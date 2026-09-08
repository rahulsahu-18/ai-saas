import "dotenv/config";
import { toNodeHandler } from "better-auth/node";
import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";
import document from "./routes/document.routes.js";
import api from "./routes/api.routes.js";
import chatRouter from "./routes/chat.routes.js";
import creditRouter from "./routes/credit.routes.js";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);


app.use(express.json());
app.all("/api/auth/*splat",toNodeHandler(auth));
app.use('/api/v1',document);
app.use('/api/v1',chatRouter);
app.use('/api/v1', api);
app.use('/api/v1', creditRouter);
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});