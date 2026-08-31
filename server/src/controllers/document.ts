import { Request, Response } from "express";
import crypto from "node:crypto";
import path from "node:path";

import { getSupabase } from "../utils/superbase.js";
import getContentType from "../utils/utils.js";

const ingestDocument = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    // 1. Check file
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // 2. Get user ID
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    // 3. Allowed extensions
    const allowedExtensions = [".pdf", ".docx", ".txt"];

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return res.status(400).json({
        success: false,
        error: "Only PDF, DOCX and TXT files are allowed",
      });
    }

    // 4. Allowed MIME types
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/octet-stream",
    ];

    // Allow octet-stream because some clients don't
    // correctly send the MIME type.
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported MIME type: ${file.mimetype}`,
      });
    }

    // 5. Create document ID
    const documentId = crypto.randomUUID();

    // 6. Sanitize filename
    const filename = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    // 7. Create storage path
    const filePath = `${userId}/${documentId}/${filename}`;

    // console.log("Uploading:", {
    //   userId,
    //   documentId,
    //   filename,
    //   mimetype: file.mimetype,
    //   extension,
    //   size: file.size,
    //   filePath,
    // });

    // 8. Upload to Supabase
    const supabase = getSupabase();

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(filePath, file.buffer, {
        contentType:
          file.mimetype === "application/octet-stream"
            ? getContentType(extension)
            : file.mimetype,

        upsert: false,
      });

    // 9. Supabase error
    if (error) {
      console.error("Supabase upload error:", error);

      return res.status(500).json({
        success: false,
        error: "Failed to upload file",
        details: error.message,
      });
    }

    // 10. Success
    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      documentId,
      path: data.path,
    });
  } catch (error) {
    console.error("Ingest error:", error);

    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

const getAllDocuments = async (req: Request, res: Response) => { }

const deleteDocument = async (req: Request, res: Response) => { }

export { ingestDocument, getAllDocuments, deleteDocument };