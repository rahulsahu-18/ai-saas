import express from "express";
import { deleteYoutubeData, ingestYoutubeData } from "../controllers/youtube.controller.js";

const youtubeRoutes = express.Router();

youtubeRoutes.post('/add-youtube',ingestYoutubeData);
youtubeRoutes.delete('/delete-youtube',deleteYoutubeData);

export default youtubeRoutes;