import express from "express";
const router = express.Router();
import { MessagesModel } from "../models/message.js";

// POST request to create a new message
router.post("/",async (req,res)=>{
    const newMessage=new MessagesModel({
        chatId:req.body.chatId,
        senderId:req.body.senderId,
        text:req.body.text
    })
    try {
        const savedMessage=await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (error) {
      console.log(error);  
    }
})

// get request to get all the messages

router.get('/:chatId', async (req,res)=>{
    try {
      const message=await MessagesModel.find({
        chatId:req.params.chatId
      });
      res.status(200).json(message);
    } catch (error) {
      console.log(error);   
    }
})



export { router as MessagesRouter };