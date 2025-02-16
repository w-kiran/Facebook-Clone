import express from "express";
import { deleteConversation, deleteMessage, getMessages, sendMessage } from "../controllers/message.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.route("/sendmessage").post(isAuth, sendMessage);
router.route("/all/:id").get(isAuth,getMessages);
router.route("/deletemessage").delete(isAuth,deleteMessage);
router.route("/deleteconversation").post(isAuth, deleteConversation); 

export default router;
