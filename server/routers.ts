import { ADMIN_COOKIE } from "./adminAuth";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createContact,
  getAllContacts,
  markContactAsRead,
  replyToContact,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  createSessionBooking,
  getAllSessionBookings,
  updateBookingStatus,
} from "./db";
import { verifyPaddleWebhook } from "./paddle";
import { TRPCError } from "@trpc/server";
import fs from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";

// Fallback: save contact to JSON file when DB is unavailable
function saveContactToFile(contact: Record<string, unknown>) {
  try {
    const filePath = path.join(process.cwd(), "contacts-fallback.json");
    const existing = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
      : [];
    existing.push({ ...contact, savedAt: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  } catch {
    console.error("[Contact] Failed to save contact to file fallback");
  }
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    adminCheck: publicProcedure.query((opts) => ({ isAdmin: opts.ctx.isAdmin })),
    adminLogout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(ADMIN_COOKIE, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Contacts ─────────────────────────────────────────────────────────────
  contacts: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          subject: z.string().optional(),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await createContact(input);
        } catch {
          // DB unavailable — save to file so message is not lost
          saveContactToFile(input);
        }
        return { success: true };
      }),

    list: adminProcedure.query(async () => getAllContacts()),

    markAsRead: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await markContactAsRead(input.id);
        return { success: true };
      }),

    reply: adminProcedure
      .input(z.object({ id: z.number(), reply: z.string().min(1) }))
      .mutation(async ({ input }) => {
        await replyToContact(input.id, input.reply);
        return { success: true };
      }),
  }),

  // ─── Products ─────────────────────────────────────────────────────────────
  products: router({
    list: publicProcedure.query(async () => {
      const rows = await getAllProducts();
      return rows.map((p) => ({ ...p, tags: JSON.parse(p.tags || "[]") }));
    }),

    featured: publicProcedure.query(async () => {
      const rows = await getFeaturedProducts();
      return rows.map((p) => ({ ...p, tags: JSON.parse(p.tags || "[]") }));
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const p = await getProductById(input.id);
        if (!p) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        return { ...p, tags: JSON.parse(p.tags || "[]") };
      }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          price: z.string(),
          category: z.string().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          tags: z.array(z.string()).optional(),
          inStock: z.number().optional(),
          featured: z.number().optional(),
          downloadUrl: z.string().optional(),
          paddlePriceId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await createProduct({
          ...input,
          tags: JSON.stringify(input.tags ?? []),
          inStock: input.inStock ?? 1,
          featured: input.featured ?? 0,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          category: z.string().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
          tags: z.array(z.string()).optional(),
          inStock: z.number().optional(),
          featured: z.number().optional(),
          downloadUrl: z.string().optional(),
          paddlePriceId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, tags, ...rest } = input;
        await updateProduct(id, {
          ...rest,
          ...(tags !== undefined ? { tags: JSON.stringify(tags) } : {}),
        });
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteProduct(input.id);
        return { success: true };
      }),
  }),

  // ─── Orders ───────────────────────────────────────────────────────────────
  orders: router({
    create: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(1),
          customerEmail: z.string().email(),
          customerPhone: z.string().optional(),
          items: z.array(
            z.object({
              productId: z.number(),
              title: z.string(),
              price: z.string(),
              quantity: z.number(),
            })
          ),
          totalAmount: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        let orderId: number | null = null;
        let paddlePriceIds: string[] = [];

        try {
          const result = await createOrder({
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            items: JSON.stringify(input.items),
            totalAmount: input.totalAmount,
            status: "pending",
          });
          orderId = (result as any).insertId ?? null;

          // Fetch paddle price IDs from products
          const productDetails = await Promise.all(
            input.items.map((i) => getProductById(i.productId))
          );
          paddlePriceIds = productDetails
            .map((p) => (p as any)?.paddlePriceId)
            .filter(Boolean);
        } catch (err) {
          console.error("[Order] DB unavailable, proceeding without DB:", err);
        }

        return {
          success: true,
          orderId,
          paddlePriceIds,
        };
      }),

    list: adminProcedure.query(async () => {
      const rows = await getAllOrders();
      return rows.map((o) => ({ ...o, items: JSON.parse(o.items) }));
    }),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "paid", "failed", "refunded"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateOrderStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // ─── Session Bookings ──────────────────────────────────────────────────────
  bookings: router({
    create: publicProcedure
      .input(
        z.object({
          studentName: z.string().min(1),
          studentEmail: z.string().email(),
          studentPhone: z.string().optional(),
          packageType: z.string().min(1),
          sessionCount: z.number().min(1),
          totalAmount: z.string(),
          notes: z.string().optional(),
          paddlePriceId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await createSessionBooking({
            studentName: input.studentName,
            studentEmail: input.studentEmail,
            studentPhone: input.studentPhone,
            packageType: input.packageType,
            sessionCount: input.sessionCount,
            totalAmount: input.totalAmount,
            notes: input.notes,
            status: "pending",
          });
        } catch (err) {
          console.error("[Booking] DB unavailable:", err);
        }

        return {
          success: true,
          paddlePriceId: input.paddlePriceId ?? null,
        };
      }),

    list: adminProcedure.query(async () => getAllSessionBookings()),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "paid", "confirmed", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateBookingStatus(input.id, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
