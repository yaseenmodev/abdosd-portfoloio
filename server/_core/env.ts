export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  adminJwtSecret: process.env.ADMIN_JWT_SECRET ?? "change-this-secret-in-env",
  paymobApiKey: process.env.PAYMOB_API_KEY ?? "",
  paymobIntegrationId: process.env.PAYMOB_INTEGRATION_ID ?? "",
  paymobIframeId: process.env.PAYMOB_IFRAME_ID ?? "",
  paymobHmacSecret: process.env.PAYMOB_HMAC_SECRET ?? "",
};
