import express from "express";
import { deletewebData, ingestWebData } from "../controllers/website.controller.js";

const websiteRouter = express.Router();

websiteRouter.post('/add-webdata',ingestWebData);
websiteRouter.delete('/delete-webdata',deletewebData);

export default websiteRouter;