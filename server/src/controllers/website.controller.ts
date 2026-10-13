import { Request, Response } from "express";
import crypto from "node:crypto";
import { getAuthenticatedUserId } from "../utils/utils.js";
import { checkWebsite, getTextData } from "../utils/wesite.service.js";
import { chunkAndEmbading } from "../utils/rag.js";
import { prisma } from "../lib/prisma.js";
import { pineconeIndex } from "../utils/pinecone.config.js";

const DOCUMENT_CREDIT_COST = 2;

export const ingestWebData = async (req:Request,res:Response) => {
    const url = req.body.url as string;
    const userId = await getAuthenticatedUserId(req);
    if(!userId)
    {
        return res.status(500).json({success:false,message:"forbidden request"});
    }
    if(!url) {
        return res.status(400).json({success:false,message:"website link is missing"});
    }
    const isValid = checkWebsite(url);
    if(!isValid)
         return res.status(400).json({success:false,message:"give a valid website link"});
    try {
        const {text,title} = await getTextData(url);
        const documentId = crypto.randomUUID();
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
                      description: `Website upload: ${title}`,
                    },
                  });
        
                  // Create document record
                  await transaction.document.create({
                    data: {
                      id: documentId,
                      fileName: title,
                      userId,
                      sourceType: "WEBSITE",
                      fileType: "webData",
                      sourceUrl: url,
                    }
                  });
        
                  return true;
                });
        
                if (!charged) {
                  return res.status(402).json({
                    success: false,
                    error: "Insufficient credits. Uploading a website requires 2 credits.",
                  });
                }
        await chunkAndEmbading({userId,text,fileName:title,documentId,sourceType:'WEBSITE',sourceUrl:url});
        return res.status(200).json({success:true,message:'data added successfully',documentId});
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:true,message:'error while website data scraped'});
    }

}

export const deletewebData =  async (req:Request,res:Response) => {
  const userId = await getAuthenticatedUserId(req);
  const documentId = req.body.id as string;
  
  if (!userId) {
    return res.status(401).json({success:false,message:'unauthorized request'});
  }
  
  if(!documentId) {
    return res.status(400).json({success:false,message:'document id is required'});
  }
  
  try {
        await pineconeIndex.deleteMany({
          documentId,
          userId
        });
        await prisma.document.delete({where:{id:documentId,userId}});
        return res.status(200).json({success:true,message:'delete data successfully'});
  } catch (error) {
    return res.status(400).json({success:false,message:'error while delete data'});
  }
}
