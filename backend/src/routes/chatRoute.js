import express  from "express";
import { ChatModel } from "../models/chat.js";


const router = express.Router();

// Save chat to the database
router.post("/", async (req, res) => {
  const { firstId, secondId } = req.body;
  const chat = new ChatModel({
    members: [firstId, secondId],
  });

  try {
    const savedChat = await chat.save();
    res.status(200).json(savedChat);
    console.log(savedChat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Find chat with a specific clicked user
router.get("/:firstId/:secondId", async (req, res) => {
  const { firstId, secondId } = req.params;
  
  try {
    const chat = await ChatModel.find({
      members: { $all: [firstId, secondId] },
    });
    if(chat) {
      res.status(200).json(chat);
    }
    else {
      res.status(200).json("no chatId created");
    }
   
  } catch (error) {
    console.log(error);
  }
});

export { router as chatRouter};