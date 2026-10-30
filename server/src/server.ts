import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./lib/auth.js";
import { trustedOrigins } from "./lib/trusted-origins.js";

import document from "./routes/document.routes.js";
import api from "./routes/api.routes.js";
import chatRouter from "./routes/chat.routes.js";
import creditRouter from "./routes/credit.routes.js";
import websiteRouter from "./routes/website.routes.js";
import youtubeRoutes from "./routes/youtube.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// Trust the reverse proxy when deployed behind one.
// Configure according to your hosting environment.
if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

// CORS must run before your routes.
app.use(
  cors({
    origin: trustedOrigins,
    credentials: true,
  })
);

// Better Auth handler.
// Register this before express.json() so Better Auth can handle
// its own request body parsing.
app.all("/api/auth/*splat", toNodeHandler(auth));

// Parse JSON for application API routes.
app.use(express.json({ limit: "1mb" }));

// Application routes
app.use("/api/v1", document);
app.use("/api/v1", chatRouter);
app.use("/api/v1", api);
app.use("/api/v1", creditRouter);
app.use("/api/v1", websiteRouter);
app.use("/api/v1", youtubeRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Doc Helper API is running",
  });
});

// Error handler
app.use(
  (
    err: Error & { status?: number },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Server error:", err);

    res.status(err.status ?? 500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
    });
  }
);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
