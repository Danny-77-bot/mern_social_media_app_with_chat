import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { UserModel } from "../models/Users.js";
import { PostModel } from "../models/Post.js";

const router = express.Router();

const __dirname = path.resolve(path.dirname(''));
console.log(__dirname);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "src", "assets", "uploads");
    console.log("Upload directory path:", uploadDir);
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const filename = `${uniqueFilename}${fileExtension}`;
    cb(null, filename);
  },
});

const uploads = multer({ storage: storage });

router.post("/", uploads.single("imageFile"), async (req, res) => {
  try {
    const { name, description, userOwner } = req.body;

    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const post = new PostModel({
      name,
      description,
      imageUrl: req.file.filename,
      userOwner,
    });

    const result = await post.save();

    fs.access(req.file.path, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("Error checking file existence:", err);
      } else {
        console.log("File exists in the uploads directory");
      }
    });

    res.status(201).json({
      createdPost: result,
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await PostModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a post
router.put("/save", async (req, res) => {
  const { postId, userID } = req.body;
  console.log(postId,userID);
  try {
    const user = await UserModel.findById(userID);
  const post = await PostModel.findById(postId);
  console.log(user,post);
  const isSaved = user.savedPosts.some(savedPost =>
     savedPost.equals(post._id)
  );
  console.log(isSaved);
      if (!isSaved) {
          user.savedPosts.push(post);
          await user.save();
          console.log("Post saved successfully");
    
          // Return updated saved posts for the user
          return res.status(200).json(user.savedPosts);
        } else {
          console.log("Post already saved");
          return res.status(400).json({ error: "Post already saved" });
        }
  } catch (error) {
        console.error("Error while saving post:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

 });


router.get("/savedPosts/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Populate the savedPosts array with the actual post objects
    const savedPosts = await PostModel.find({ _id: { $in: user.savedPosts} });
   
     res.status(200).json({ savedPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/deletePost", async (req, res) => {
  const { userID, postId } = req.body;

  try {
    const post = await PostModel.findOne({ _id: postId }).exec();
    const userPosts = await PostModel.find({ userOwner: post.userOwner }).exec();
    // console.log("Posts owned by user:", userPosts);
    await PostModel.deleteOne({ _id: postId }).exec();
     res.json(userPosts);
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/deleteSaved/:postID", async (req, res) => {
  try {
    const { postID} = req.params;
    const user = await UserModel.findOne({ savedPosts:postID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.savedPosts = user.savedPosts.filter((savedPost) => {
      return !savedPost.equals(postID);
    });
    await user.save();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error in delete saved:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export  { router as postRouter };