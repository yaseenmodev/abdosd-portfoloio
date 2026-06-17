import crypto from "node:crypto";
import { ENV } from "./_core/env";

const PAYMOB_BASE = "https://accept.paymob.com/api";

export type PaymobOrderItem = {
  name: string;
  amount_cents: number;
  description: string;
  quantity: number;
};

export type CreatePaymentResult = {
  paymentKey: string;
  iframeUrl: string;
  paymobOrderId: string;
};

// Step 1: Get authentication token
async function getAuthToken(): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: ENV.paymobApiKey }),
  });

  if (!res.ok) {
    throw new Error(`Paymob auth failed: ${res.status}`);
  }

  const data = (await res.json()) as { token: string };
  return data.token;
}

// Step 2: Register order with Paymob
async function registerOrder(
  authToken: string,
  amountCents: number,
  items: PaymobOrderItem[]
): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      items,
    }),
  });

  if (!res.ok) {
    throw new Error(`Paymob order creation failed: ${res.status}`);
  }

  const data = (await res.json()) as { id: number };
  return String(data.id);
}

// Step 3: Get payment key
async function getPaymentKey(
  authToken: string,
  orderId: string,
  amountCents: number,
  billingData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  }
): Promise<string> {
  const res = await fetch(`${PAYMOB_BASE}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        ...billingData,
        apartment: "N/A",
        floor: "N/A",
        street: "N/A",
        building: "N/A",
        shipping_method: "N/A",
        postal_code: "N/A",
        city: "N/A",
        country: "EG",
        state: "N/A",
        last_name: billingData.last_name,
      },
      currency: "EGP",
      integration_id: parseInt(ENV.paymobIntegrationId),
    }),
  });

  if (!res.ok) {
    throw new Error(`Paymob payment key failed: ${res.status}`);
  }

  const data = (await res.json()) as { token: string };
  return data.token;
}

// Main: create full payment session
export async function createPaymobPayment(params: {
  amountCents: number;
  items: PaymobOrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}): Promise<CreatePaymentResult> {
  const { amountCents, items, customerName, customerEmail, customerPhone } = params;

  const nameParts = customerName.trim().split(" ");
  const firstName = nameParts[0] ?? "Customer";
  const lastName = nameParts.slice(1).join(" ") || "N/A";

  const authToken = await getAuthToken();
  const paymobOrderId = await registerOrder(authToken, amountCents, items);
  const paymentKey = await getPaymentKey(authToken, paymobOrderId, amountCents, {
    first_name: firstName,
    last_name: lastName,
    email: customerEmail,
    phone_number: customerPhone || "01000000000",
  });

  const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${ENV.paymobIframeId}?payment_token=${paymentKey}`;

  return { paymentKey, iframeUrl, paymobOrderId };
}

// Webhook HMAC verification
export function verifyPaymobHmac(params: Record<string, string>, hmac: string): boolean {
  if (!ENV.paymobHmacSecret) return false;

  const keys = [
    "amount_cents",
    "created_at",
    "currency",
    "error_occured",
    "has_parent_transaction",
    "id",
    "integration_id",
    "is_3d_secure",
    "is_auth",
    "is_capture",
    "is_refunded",
    "is_standalone_payment",
    "is_voided",
    "order",
    "owner",
    "pending",
    "source_data.pan",
    "source_data.sub_type",
    "source_data.type",
    "success",
  ];

  const concatenated = keys.map((k) => params[k] ?? "").join("");
  const computed = crypto
    .createHmac("sha512", ENV.paymobHmacSecret)
    .update(concatenated)
    .digest("hex");

  return computed === hmac;
}
