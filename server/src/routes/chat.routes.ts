import express from "express"
import { allChat, chat, singleChat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.get('all-chat',allChat);
chatRouter.get('chat/:id',singleChat);
chatRouter.post('chat/message/:id?',chat);

export default chatRouter;