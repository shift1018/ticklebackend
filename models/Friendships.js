import mongoose, { Schema } from "mongoose";

const FriendshipsSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    friend: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    approvedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Friendships", FriendshipsSchema);
