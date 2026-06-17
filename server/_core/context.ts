import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifyAdminToken, getAdminTokenFromRequest } from "../adminAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  isAdmin: boolean;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let isAdmin = false;
  const adminToken = getAdminTokenFromRequest(opts.req);
  if (adminToken) {
    isAdmin = await verifyAdminToken(adminToken);
  }
  return { req: opts.req, res: opts.res, isAdmin };
}
