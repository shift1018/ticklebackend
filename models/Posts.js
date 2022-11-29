import mongoose, { Schema } from "mongoose";

const PostsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createDate: {
      type: Date,
      default: Date.now,
    },
    imageURL: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    reactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reactions",
      },
    ],

    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    photos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photos",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Posts", PostsSchema)
