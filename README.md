# Dr. Abdellrahman Saffa Aldin — Portfolio & Medical Platform

Full-stack web application for a medical doctor's portfolio, USMLE Step 1 mentoring business, and medical illustrations shop.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4 + Vite
- **Backend:** Node.js + Express + tRPC (type-safe API)
- **Database:** MySQL (Drizzle ORM)
- **Payments:** Paymob (Egypt)
- **Auth:** JWT-based admin sessions

## Features

### Public Pages
- `/` — Doctor profile, mentoring packages, shop preview, FAQ, contact form
- `/shop` — Medical illustrations shop with search & filters
- `/shop/:id` — Product detail page
- `/cart` — Shopping cart
- `/checkout` — Checkout with Paymob payment

### Admin Panel (`/dr-panel-2024`)
- Dashboard with revenue + activity overview
- Products management (CRUD, image URL, featured toggle)
- Orders management with status updates
- Session bookings tracker
- Messages inbox with reply support

## Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in values:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database?ssl-mode=REQUIRED

# Admin login
ADMIN_EMAIL=drasdpersonal@gmail.com
ADMIN_PASSWORD=your-secure-password
ADMIN_JWT_SECRET=your-random-secret
JWT_SECRET=your-random-secret

# Paymob (get from https://accept.paymob.com/portal2/en/settings)
PAYMOB_API_KEY=your-api-key
PAYMOB_INTEGRATION_ID=your-integration-id
PAYMOB_IFRAME_ID=your-iframe-id
PAYMOB_HMAC_SECRET=your-hmac-secret
```

### 3. Setup Database
```bash
pnpm db:push
```

### 4. Run Development Server
```bash
pnpm dev
```
Visit `http://localhost:3000`

## Paymob Integration

### Getting Credentials
1. Create an account at [Paymob](https://accept.paymob.com)
2. Go to Settings → API Keys to get your `PAYMOB_API_KEY`
3. Create a payment integration (Card type) → get `PAYMOB_INTEGRATION_ID`
4. Create an iFrame → get `PAYMOB_IFRAME_ID`
5. Set your HMAC secret in Settings → Security

### Payment Policies Displayed to Customers
- All payments processed via Paymob (PCI-DSS compliant)
- Payments in EGP (Egyptian Pound)
- Digital products non-refundable after download
- Supported: Visa, MasterCard, Meeza, mobile wallets
- Card details never stored on server

### Webhook Setup
Register your server's `/api/paymob/callback` endpoint in Paymob dashboard for payment notifications.

## Pending Customization

Replace these placeholders before going live:
- `[INSTAGRAM_HANDLE]` — Instagram username in `Home.tsx`
- `/dr_profile.jpg` — Doctor's profile photo in `client/public/`

## Build for Production
```bash
pnpm build
pnpm start
```
