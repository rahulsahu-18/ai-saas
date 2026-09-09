# Razorpay Credit Purchase Setup

## Pricing

Users choose the number of credits they want to buy. Each credit costs **Rs 2**.

```
total in rupees = credits x 2
total in paise  = credits x 200
```

For example, 10 credits cost Rs 20 and Razorpay receives an amount of `2000` paise.

## Purchase Flow

1. The user enters a positive whole number of credits.
2. The client calls `POST /api/v1/payment/create-order` with that amount.
3. The server calculates the price, creates a Razorpay order, and stores the chosen credit count in the order notes.
4. Razorpay Checkout collects payment.
5. The client sends the payment details to `POST /api/v1/payment/verify`.
6. The server validates Razorpay's signature, then atomically adds the credits and records a `PURCHASE` transaction.

The credit count used after payment comes from the Razorpay order, not from the client request.

## Install And Configure

Install the Razorpay server package:

```bash
cd server
npm install razorpay
```

Add server credentials to [server/.env](server/.env):

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

Add the public key to `client/.env`:

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

Get test or live keys from the Razorpay Dashboard: https://dashboard.razorpay.com/app/keys

Never put `RAZORPAY_KEY_SECRET` in the client environment file or browser code.

## Routes

Register the payment router in [server/src/server.ts](server/src/server.ts):

```ts
import paymentRoutes from "./routes/payment.routes.js";

app.use("/api/v1/payment", paymentRoutes);
```

The router exposes these endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/payment/create-order` | Create an order for a selected number of credits. |
| `POST` | `/api/v1/payment/verify` | Validate a successful checkout and add credits. |
| `GET` | `/api/v1/payment/pricing` | Return the current price per credit. |

## API Examples

### Create An Order

```http
POST /api/v1/payment/create-order
Content-Type: application/json
```

```json
{
  "credits": 10
}
```

```json
{
  "success": true,
  "order": {
    "id": "order_xxx",
    "amount": 2000,
    "currency": "INR",
    "credits": 10,
    "displayPrice": "Rs 20"
  }
}
```

The `credits` value must be a positive integer. The server calculates the order amount; the client must not calculate or provide an amount.

### Verify A Payment

```http
POST /api/v1/payment/verify
Content-Type: application/json
```

```json
{
  "orderId": "order_xxx",
  "paymentId": "pay_xxx",
  "signature": "razorpay_signature_from_checkout"
}
```

```json
{
  "success": true,
  "message": "Payment verified and credits added successfully",
  "credits": 10
}
```

### Get Current Pricing

```http
GET /api/v1/payment/pricing
```

```json
{
  "success": true,
  "pricePerCredit": 2,
  "currency": "INR",
  "message": "Each credit costs Rs 2"
}
```

## Frontend

[client/src/components/BuyCredits.tsx](client/src/components/BuyCredits.tsx) loads Razorpay Checkout, accepts a number of credits, and displays the calculated total. Render it where users can top up their balance:

```tsx
import BuyCredits from "@/components/BuyCredits";

export default function CreditsPage() {
  return <BuyCredits onSuccess={() => {/* refresh the credit balance */}} />;
}
```

## Database Result

After a verified payment, the server transaction:

1. Creates or increments the user's `CreditAccount.balance`.
2. Creates a `CreditTransaction` with type `PURCHASE` and the credit amount.

## Testing

Use Razorpay test keys and a test payment method from Razorpay's documentation. Test this sequence:

1. Purchase 10 credits and confirm the checkout total is Rs 20.
2. Complete payment in test mode.
3. Confirm the `CreditAccount` balance increased by 10.
4. Confirm exactly one `CreditTransaction` with type `PURCHASE` was created.

## Production Checklist

- [ ] Use live Razorpay credentials only after test mode works.
- [ ] Use HTTPS for the application.
- [ ] Keep the Razorpay key secret on the server only.
- [ ] Verify every payment server-side before adding credits.
- [ ] Test failed, cancelled, and duplicate payment cases.
