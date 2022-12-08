import mongoose, { Schema } from "mongoose";

const PhotosSchema = new mongoose.Schema(
  {
    photoURL: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Photos", PhotosSchema);
