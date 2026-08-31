import express from "express";
import upload from "../middleware/upload.js";
import { deleteDocument, getAllDocuments, ingestDocument } from "../controllers/document.js";

const document = express.Router();

document.post("/ingest", upload.single("file"), ingestDocument);
document.get("/get-all", getAllDocuments);
document.delete("/delete-document/:id", deleteDocument);

export default document;