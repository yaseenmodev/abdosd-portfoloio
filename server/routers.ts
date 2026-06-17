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
  getOrderById,
  updateOrderStatus,
  updateOrderByPaymobId,
  createSessionBooking,
  getAllSessionBookings,
  updateBookingByPaymobId,
} from "./db";
import { createPaymobPayment, verifyPaymobHmac } from "./paymob";
import { TRPCError } from "@trpc/server";
import type { Request, Response } from "express";

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
        await createContact(input);
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
        const order = await createOrder({
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          items: JSON.stringify(input.items),
          totalAmount: input.totalAmount,
          status: "pending",
        });

        const amountCents = Math.round(parseFloat(input.totalAmount) * 100);

        let paymobResult = null;
        try {
          paymobResult = await createPaymobPayment({
            amountCents,
            items: input.items.map((i) => ({
              name: i.title,
              amount_cents: Math.round(parseFloat(i.price) * 100 * i.quantity),
              description: i.title,
              quantity: i.quantity,
            })),
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone ?? "",
          });
        } catch (err) {
          console.error("[Paymob] Failed to create payment:", err);
        }

        return {
          success: true,
          iframeUrl: paymobResult?.iframeUrl ?? null,
          paymobOrderId: paymobResult?.paymobOrderId ?? null,
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
        })
      )
      .mutation(async ({ input }) => {
        await createSessionBooking({
          ...input,
          status: "pending",
        });

        const amountCents = Math.round(parseFloat(input.totalAmount) * 100);

        let paymobResult = null;
        try {
          paymobResult = await createPaymobPayment({
            amountCents,
            items: [
              {
                name: `USMLE Step 1 Mentoring - ${input.packageType}`,
                amount_cents: amountCents,
                description: `${input.sessionCount} session(s)`,
                quantity: 1,
              },
            ],
            customerName: input.studentName,
            customerEmail: input.studentEmail,
            customerPhone: input.studentPhone ?? "",
          });
        } catch (err) {
          console.error("[Paymob] Failed to create booking payment:", err);
        }

        return {
          success: true,
          iframeUrl: paymobResult?.iframeUrl ?? null,
        };
      }),

    list: adminProcedure.query(async () => getAllSessionBookings()),

    updateStatus: adminProcedure
      .input(
        z.object({
          paymobOrderId: z.string(),
          status: z.enum(["pending", "paid", "confirmed", "completed", "cancelled"]),
          paymobTransactionId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await updateBookingByPaymobId(
          input.paymobOrderId,
          input.status,
          input.paymobTransactionId
        );
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
