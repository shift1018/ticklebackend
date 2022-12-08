import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";

import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import postRoute from "./routes/posts.js";
import friendsRoute from "./routes/friend.js";
import commentsRoute from "./routes/comments.js";
import photoRoute from "./routes/photo.js";
import reactionRoute from "./routes/reactions.js"
dotenv.config();

// Constants
const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Middleware
app.use(cors()); //to send requests from different ip to the backend
app.use(express.json()); // send json from frontend to backend
app.use(fileUpload()); // for upload images
app.use(express.static("uploads")); //folder where to upload images

// test connection initial route
// http://localhost:8800/
// app.get("/", (req, res) => {
//   return res.json({ message: "Connected!" });
// });

// Routes (part of middleware)
// starting route for user registration/login
app.use("/api/auth", authRoute);

app.use("/users", usersRoute);
app.use("/api/friends", friendsRoute);

app.use("/api/posts", postRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/photos", photoRoute);
app.use("/api/reactions", reactionRoute);


async function start() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.5rhohrz.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
    );

    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

// app.listen(8800, () => {
//   console.log("Backend server is running!");
// });
