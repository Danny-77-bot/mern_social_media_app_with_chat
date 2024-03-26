import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const UserModel = mongoose.model("User", UserSchema); // Define UserModel

export { UserModel }; // Export UserModel
