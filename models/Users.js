import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarURL: {
      type: String,
    },
    role: [
      {
        type: String,
        required: true,
        default: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],

    reactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reactions",
      },
    ],
    friendships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Friendships",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Users", UsersSchema);
