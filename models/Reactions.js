import mongoose, { Schema } from "mongoose";

const ReactionsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reactions", ReactionsSchema);
