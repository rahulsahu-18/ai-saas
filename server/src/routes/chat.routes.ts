import express from "express"
import { allChat, chat, singleChat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get('/chat/all-chat',allChat);
chatRouter.get('/chat/:id',singleChat);
chatRouter.post('/chat/message',chat);
chatRouter.post('/chat/message/:id',chat);

export default chatRouter;