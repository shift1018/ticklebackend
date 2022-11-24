import mongoose, { Schema } from "mongoose";

const PhotosSchema = new mongoose.Schema(
  {
    photoURL: {
      type: String,
      required: true,
    },
    album: {
      type: Schema.Types.ObjectId,
      ref: "Albums",
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Photos", PhotosSchema);
