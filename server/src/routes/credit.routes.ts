import express from "express";
import {
  getAllCreditTransactions,
  getCreditBalance,
} from "../controllers/credit.controller.js";

const creditRouter = express.Router();

creditRouter.get("/credit/balance", getCreditBalance);
creditRouter.get("/credit/transactions", getAllCreditTransactions);

export default creditRouter;
