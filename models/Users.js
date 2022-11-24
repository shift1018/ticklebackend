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
    profileURL: {
      type: String,
    },
    city: {
      type:String,
      max:25,

    },
    from: {
      type: String,
      max:25,
    },
    birtday: {
      type: Date,

    },
    desc: {
      type: String,
      max:100,
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
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Albums",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Users", UsersSchema);

// const UsersModel = mongoose.model("Users", UsersSchema);
// module.exports = UsersModel;
