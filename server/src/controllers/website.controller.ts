import { Request, Response } from "express";
import { getAuthenticatedUserId } from "../utils/utils.js";
import { checkWebsite, getTextData } from "../utils/wesite.service.js";
import { chunkAndEmbading } from "../utils/rag.js";
import { prisma } from "../lib/prisma.js";
import { pineconeIndex } from "../utils/pinecone.config.js";

export const ingestWebData = async (req:Request,res:Response) => {
    const url = req.body.url as string;
    // const userId = await getAuthenticatedUserId(req);
    const userId = req.body.userId;
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
        // creadit check

        const {text,title} = await getTextData(url);
        const documentId = crypto.randomUUID();
        await chunkAndEmbading({userId,text,fileName:title,documentId,sourceType:'WEBSITE',sourceUrl:url});
        await prisma.document.create({data:{userId,fileName:title,id:documentId,sourceType:"WEBSITE",fileType:'webData'}});
        return res.status(200).json({success:true,message:'data added successfully',documentId});
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:true,message:'error while website data scraped'});
    }

}

export const deletewebData =  async (req:Request,res:Response) => {
  const userId = await getAuthenticatedUserId(req);
// const userId = req.body.userId;
  const documentId = req.body.id as string;
  if(!documentId) {
    return res.status(400).json({success:true,message:'forbiden request'});
  }
  try {
        await pineconeIndex.deleteMany({
          documentId,
          userId
        });
        await prisma.document.delete({where:{id:documentId}});
        return res.status(200).json({success:true,message:'delete data successfully'});
  } catch (error) {
    return res.status(400).json({success:true,message:'error while delete data'});
  }
}
