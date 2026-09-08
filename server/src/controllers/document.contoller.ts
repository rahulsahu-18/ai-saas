import { Request, Response } from "express";
import crypto from "node:crypto";
import path from "node:path";

import { getSupabase, supabase } from "../utils/superbase.js";
import { prisma } from "../lib/prisma.js";
import { getAuthenticatedUserId, getContentType, processDocument } from "../utils/utils.js";
import { chunkAndEmbading } from "../utils/rag.js";
import { pineconeIndex } from "../utils/pinecone.config.js";

const DOCUMENT_CREDIT_COST = 2;



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
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    // 3. Allowed extensions
    const allowedExtensions = [".pdf", ".docx", ".txt"];

    const extension = path.extname(file.originalname).toLowerCase();
    const fileType = getContentType(extension);
    
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
    const fileName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    ) as string;

    // 7. Create storage path
    const filePath = `${userId}/${documentId}/${fileName}`;
    const supabase = getSupabase();

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(filePath, file.buffer, {
        contentType:
          file.mimetype === "application/octet-stream"
            ? fileType
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

    const charged = await prisma.$transaction(async (transaction) => {
      const result = await transaction.creditAccount.updateMany({
        where: {
          userId,
          balance: {
            gte: DOCUMENT_CREDIT_COST,
          },
        },
        data: {
          balance: {
            decrement: DOCUMENT_CREDIT_COST,
          },
        },
      });

      if (result.count === 0) {
        return false;
      }

      await transaction.creditTransaction.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          amount: -DOCUMENT_CREDIT_COST,
          type: "USAGE",
          description: `Document upload: ${fileName}`,
        },
      });

      return true;
    });

    if (!charged) {
      await supabase.storage.from("documents").remove([filePath]);

      return res.status(402).json({
        success: false,
        error: "Insufficient credits. Uploading a document requires 2 credits.",
      });
    }

    const document = await prisma.document.create({
      data: {
        id: documentId,
        userId,
        fileName,
        fileType,
        fileSize: file.size,
        storagePath: filePath,
        status: "PROCESSING",
      },
    });

    // process document

    const text = await processDocument({
      buffer: file.buffer,
      fileType,
      userId,
      documentId,
      fileName,
    });

    // chunking

    const result = await chunkAndEmbading({
      fileName,
      text,
      userId,
      documentId,
    });

    return res.status(200).json({
      success: true,
      chunkSize: result.chunks,
      message: "document added to knowladge base",
    });
  } catch (error) {
    console.error("Ingest error:", error);

    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};

const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch documents",
    });
  }
};

const deleteDocument = async (req: Request, res: Response) => {
  try {
    const documentId = req.params.id as string;
    const userId = await getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    // delete from superbase

    const supabaseClient = getSupabase();
    const { error: storageError } =
      await supabaseClient.storage
        .from("documents")
        .remove([
          document.storagePath,
        ]);

    if (storageError) {
      throw new Error(
        `Storage deletion failed: ${storageError.message}`
      );
    }

    await pineconeIndex.deleteMany({
      documentId: document.id,
    });

    await prisma.document.delete({
      where: { id: document.id },
    });

     return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: "Failed to delete document",
    });
  }
};

export { ingestDocument, getAllDocuments, deleteDocument };
