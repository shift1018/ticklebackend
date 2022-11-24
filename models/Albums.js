import mongoose, { Schema } from "mongoose";

const AlbumsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    photos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photos",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Albums", AlbumsSchema);
