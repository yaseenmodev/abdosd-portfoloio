import { ENV } from "./_core/env";
import crypto from "node:crypto";

const PADDLE_API_BASE =
  ENV.paddleEnvironment === "sandbox"
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com";

export async function getPaddlePrice(priceId: string) {
  const res = await fetch(`${PADDLE_API_BASE}/prices/${priceId}`, {
    headers: {
      Authorization: `Bearer ${ENV.paddleApiKey}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Paddle price fetch failed: ${res.status}`);
  return res.json();
}

export function verifyPaddleWebhook(
  rawBody: string,
  signatureHeader: string
): boolean {
  if (!ENV.paddleWebhookSecret) return false;
  try {
    const [tsPart, h1Part] = signatureHeader.split(";");
    const ts = tsPart.replace("ts=", "");
    const h1 = h1Part.replace("h1=", "");
    const signed = `${ts}:${rawBody}`;
    const expected = crypto
      .createHmac("sha256", ENV.paddleWebhookSecret)
      .update(signed)
      .digest("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(h1));
  } catch {
    return false;
  }
}
