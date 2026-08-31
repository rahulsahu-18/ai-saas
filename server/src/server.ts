import express from "express";
import cors from "cors";
import { auth } from "./lib/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});