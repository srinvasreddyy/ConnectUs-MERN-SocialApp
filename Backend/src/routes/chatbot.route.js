import { chatbotReply } from "../controllers/chatbot.controller.js";
import express from 'express'
import { protectRoute } from "../lib/protectroute.js";
const router = express.Router()

router.post("/ask",protectRoute,chatbotReply)
export default router