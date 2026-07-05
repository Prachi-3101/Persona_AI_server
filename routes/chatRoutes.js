import express from "express";
const router = express.Router();
import { authenticate } from "../middlewares/auth.js";
import { getChat, chat, clearChat } from "../controllers/chatController.js";

router.get("/:persona", authenticate, getChat);
router.post("/", authenticate, chat);
router.delete("/:persona", authenticate, clearChat);

export default router;
