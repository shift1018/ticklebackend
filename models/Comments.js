import mongoose, { Schema } from "mongoose";

const CommentsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    // createDate: {
    //   type: Date,
    //   default: Date.now,
    // },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
    responseTo: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Comments", CommentsSchema);
