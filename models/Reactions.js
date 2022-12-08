import mongoose, { Schema } from "mongoose";

const ReactionsSchema = new mongoose.Schema(
  {
    reaction: {
      type: String,
      enum: ["like", "love", "haha", "sad", "angry", "wow"],
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
    reactionBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
);

export default mongoose.model("Reactions", ReactionsSchema);
