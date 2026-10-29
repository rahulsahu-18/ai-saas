import { Request, Response } from "express";
import crypto from "node:crypto";
import { extractYoutubeVideoId, getYoutubeTranscript } from "../utils/youtube.service.js";
import { prisma } from "../lib/prisma.js";
import { chunkAndEmbading } from "../utils/rag.js";
import { pineconeIndex } from "../utils/pinecone.config.js";
import { getAuthenticatedUserId } from "../utils/utils.js";

const DOCUMENT_CREDIT_COST = 2; 

export const ingestYoutubeData = async (req:Request,res:Response) => {
    const userId = await getAuthenticatedUserId(req);
    const url = req.body.url;

    if (!userId) {
        return res.status(401).json({success:false,message:"unauthorized request"});
    }
    // check url from yt or not 
    const videoId = extractYoutubeVideoId(url);
    if(!videoId) {
        return res.status(400).json({success:false,message:"Invalid YouTube video URL"});
    }

    try {
        const {text,title,unavailable} = await getYoutubeTranscript(url);

        if (unavailable) {
            return res.status(404).json({success:false,message:`The video with ID \"${videoId}\" is no longer available or has been removed. Please check the video URL or ID and try again.`});
        }

        const documentId = crypto.randomUUID();

        // Check credits and perform operations in transaction
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

          // Create credit transaction record
          await transaction.creditTransaction.create({
            data: {
              id: crypto.randomUUID(),
              userId,
              amount: -DOCUMENT_CREDIT_COST,
              type: "USAGE",
              description: `youtube video upload: ${title}`,
            },
          });

          // Create document record
          await transaction.document.create({
            data: {
              id: documentId,
              fileName: title,
              userId,
              sourceType: 'YOUTUBE',
              fileType: 'youtube video'
            }
          });

          return true;
        });

        if (!charged) {
          return res.status(402).json({
            success: false,
            message: "Insufficient credits. Uploading a YouTube video requires 2 credits.",
          });
        }

        // Process embeddings after transaction
        await chunkAndEmbading({userId,text,documentId,fileName:title,sourceType:'YOUTUBE',sourceUrl:url});
        return res.status(200).json({success:true,message:"youtube data added successfully"});
    } catch (error) {
        console.error("YouTube ingest error:", error instanceof Error ? error.message : error);
        return res.status(500).json({success:false,message:error instanceof Error ? error.message : "something went wrong while adding yt data"});
    }
}

export const deleteYoutubeData = async (req:Request,res:Response) => {
     const userId = await getAuthenticatedUserId(req);
     const id = req.body.id;

     if (!userId) {
         return res.status(401).json({success:false,message:"unauthorized request"});
     }

     try {
        await prisma.document.delete({where:{id,userId}});
        await pineconeIndex.deleteMany({documentId:id,userId});
         return res.status(200).json({success:true,message:'delete data successfully'});
     } catch (error) {
         return res.status(400).json({success:false,message:'error while delete data'});
     }
}