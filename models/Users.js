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
      max:50,

    },
    from: {
      type: String,
      max:50,
    },
    birthday: {
      type: Date,

    },
    desc: {
      type: String,
      max:500,
    },

    role: 
      {
        type: String,
        required: true,
        default: "User",
      },
    
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
    photos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photos",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Users", UsersSchema);

// const UsersModel = mongoose.model("Users", UsersSchema);
// module.exports = UsersModel;
