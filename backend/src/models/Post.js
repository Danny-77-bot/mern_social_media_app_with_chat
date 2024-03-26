import mongoose from "mongoose";

const recipeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
    description:{
      type:String,
  
    },
  imageUrl: {
    type: String,
    required: true,
  },

  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const PostModel = mongoose.model("Posts", recipeSchema);
