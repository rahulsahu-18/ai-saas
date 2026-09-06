import express from "express"
import { allChat, chat, deleteChat, singleChat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get('/chat/all-chat',allChat);
chatRouter.delete('/chat/:id', deleteChat);
chatRouter.get('/chat/:id',singleChat);
chatRouter.post('/chat/message',chat);
chatRouter.post('/chat/message/:id',chat);

export default chatRouter;