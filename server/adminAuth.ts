import crypto from "node:crypto";
import { parse as parseCookies } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import type { Express, Request, Response } from "express";
import { getSessionCookieOptions } from "./_core/cookies";
import { ENV } from "./_core/env";

export const ADMIN_COOKIE = "dr_adm_t9x2k";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  const ip = typeof fwd === "string" ? fwd.split(",")[0].trim() : null;
  return ip ?? req.socket?.remoteAddress ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = loginAttempts.get(ip);
  if (!rec || now > rec.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (rec.count >= 5) return true;
  rec.count++;
  return false;
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

function safeCompare(input: string, stored: string): boolean {
  const a = crypto.createHash("sha256").update(input).digest();
  const b = crypto.createHash("sha256").update(stored).digest();
  return crypto.timingSafeEqual(a, b);
}

function getJwtSecret() {
  return new TextEncoder().encode(ENV.adminJwtSecret);
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export function getAdminTokenFromRequest(req: Request): string | undefined {
  const cookies = parseCookies(req.headers.cookie ?? "");
  return cookies[ADMIN_COOKIE];
}

export function registerAdminAuthRoutes(app: Express) {
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      res.status(429).json({ error: "Too many attempts. Try again in 15 minutes." });
      return;
    }

    const { email, password } = req.body ?? {};

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const emailOk = email.toLowerCase() === ENV.adminEmail.toLowerCase();
    const passOk = safeCompare(password, ENV.adminPassword);

    if (!emailOk || !passOk) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    clearAttempts(ip);
    const token = await createAdminToken();
    const cookieOpts = getSessionCookieOptions(req);
    res.cookie(ADMIN_COOKIE, token, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true });
  });

  app.post("/api/admin/logout", (req: Request, res: Response) => {
    const cookieOpts = getSessionCookieOptions(req);
    res.clearCookie(ADMIN_COOKIE, { ...cookieOpts, maxAge: -1 });
    res.json({ success: true });
  });
}
