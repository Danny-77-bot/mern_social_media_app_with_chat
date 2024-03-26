import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import path from "path";
import { userRouter } from "./routes/user.js";
import { postRouter } from "./routes/posts.js";
import { profileRouter } from "./routes/profiles.js";
import { MessagesRouter } from "./routes/messages.js";
import { chatRouter } from "./routes/chatRoute.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/posts", postRouter);
app.use("/profiles", profileRouter);
app.use("/chats", chatRouter);
app.use("/messages",MessagesRouter);
// Serve static files (images)
app.use("/api/assets/uploads", express.static(path.join(__dirname, "assets", "uploads")));

mongoose
  .connect("mongodb://localhost:27017/mydatabase")
  .then(() => {
    console.log("Connected to database");
    app.listen(3005, () => {
      console.log("Server is running on port 3005");
    });
  })
  .catch((err) => console.error("Failed to connect to database:", err));