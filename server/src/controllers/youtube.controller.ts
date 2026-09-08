import { Request, Response } from "express";
import { extractYoutubeVideoId, getYoutubeTranscript } from "../utils/youtube.service.js";
import { success } from "better-auth";
import { prisma } from "../lib/prisma.js";
import { chunkAndEmbading } from "../utils/rag.js";
import { pineconeIndex } from "../utils/pinecone.config.js";

export const ingestYoutubeData = async (req:Request,res:Response) => {
    const userId = req.body.userId;
    const url = req.body.url;

    // check url from yt or not 
    const videoId = extractYoutubeVideoId(url);
    if(!videoId) {
        return res.status(400).json({success:false,message:"invalid youtube video url"});
    }
    // check creadit
     try {
         const {text,title} = await getYoutubeTranscript(url);
         const documentId = crypto.randomUUID();
         await prisma.document.create({data:{id:documentId,fileName:title,userId,sourceType:'YOUTUBE',fileType:'youtube video'}});
         await chunkAndEmbading({userId,text,documentId,fileName:title,sourceType:'YOUTUBE',sourceUrl:url});
         return res.status(200).json({success:true,message:"youtube data added successfully"});
     } catch (error) {
        console.log(error);
        return res.status(200).json({success:true,message:"something went worng while add yt data"});
     }
}

export const deleteYoutubeData = async (req:Request,res:Response) => {
     const userId = req.body.userId;
     const id = req.body.id;

     try {
        await prisma.document.delete({where:{id,userId}});
        await pineconeIndex.deleteMany({documentId:id,userId});
         return res.status(200).json({success:true,message:'delete data successfully'});
     } catch (error) {
         return res.status(400).json({success:false,message:'error while delete data'});
     }
}