import mongoose from 'mongoose';

const ChatSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatModel= mongoose.model('Chat',ChatSchema);