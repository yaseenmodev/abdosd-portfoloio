import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  users,
  contacts,
  products,
  orders,
  sessionBookings,
} from "../drizzle/schema";
import type {
  InsertUser,
  InsertContact,
  InsertProduct,
  InsertOrder,
  InsertSessionBooking,
  Contact,
  Product,
  Order,
  SessionBooking,
} from "../drizzle/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: any = null;

export async function getDb() {
  if (_db) return _db;
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;

  try {
    const url = new URL(dbUrl);
    const needsSsl = url.searchParams.has("ssl-mode") || url.searchParams.has("ssl");
    url.searchParams.delete("ssl-mode");
    url.searchParams.delete("ssl");

    const pool = mysql.createPool({
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    _db = drizzle(pool);
  } catch (error) {
    console.warn("[Database] Failed to connect:", error);
    _db = null;
  }

  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  const db = await getDb();
  if (!db) return;
  await db.insert(users).values(user).onDuplicateKeyUpdate({ set: { lastSignedIn: new Date() } });
}

// ─── Contacts ────────────────────────────────────────────────────────────────

export async function createContact(contact: InsertContact): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contacts).values(contact);
}

export async function getAllContacts(): Promise<Contact[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contacts).orderBy(contacts.createdAt) as Promise<Contact[]>;
}

export async function markContactAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(contacts).set({ read: 1 }).where(eq(contacts.id, id));
}

export async function replyToContact(id: number, reply: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(contacts)
    .set({ adminReply: reply, repliedAt: new Date(), read: 1 })
    .where(eq(contacts.id, id));
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).orderBy(products.createdAt) as Promise<Product[]>;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.featured, 1)) as Promise<Product[]>;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = (await db.select().from(products).where(eq(products.id, id)).limit(1)) as Product[];
  return result[0];
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(products).values(product);
}

export async function updateProduct(id: number, updates: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(products).set(updates).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(products).where(eq(products.id, id));
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  return result;
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(orders.createdAt) as Promise<Order[]>;
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = (await db.select().from(orders).where(eq(orders.id, id)).limit(1)) as Order[];
  return result[0];
}

export async function updateOrderStatus(
  id: number,
  status: "pending" | "paid" | "failed" | "refunded",
  paymobTransactionId?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(orders)
    .set({ status, ...(paymobTransactionId ? { paymobTransactionId } : {}) })
    .where(eq(orders.id, id));
}

export async function updateOrderByPaymobId(
  paymobOrderId: string,
  status: "pending" | "paid" | "failed" | "refunded",
  paymobTransactionId?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(orders)
    .set({ status, ...(paymobTransactionId ? { paymobTransactionId } : {}) })
    .where(eq(orders.paymobOrderId, paymobOrderId));
}

// ─── Session Bookings ─────────────────────────────────────────────────────────

export async function createSessionBooking(booking: InsertSessionBooking) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(sessionBookings).values(booking);
}

export async function getAllSessionBookings(): Promise<SessionBooking[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sessionBookings).orderBy(sessionBookings.createdAt) as Promise<SessionBooking[]>;
}

export async function updateBookingStatus(
  id: number,
  status: "pending" | "paid" | "confirmed" | "completed" | "cancelled"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(sessionBookings).set({ status }).where(eq(sessionBookings.id, id));
}

export async function updateBookingByPaymobId(
  paymobOrderId: string,
  status: "pending" | "paid" | "confirmed" | "completed" | "cancelled",
  paymobTransactionId?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(sessionBookings)
    .set({ status, ...(paymobTransactionId ? { paymobTransactionId } : {}) })
    .where(eq(sessionBookings.paymobOrderId, paymobOrderId));
}
