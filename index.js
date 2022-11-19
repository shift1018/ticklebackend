import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoute from "./routes/auth.js";

dotenv.config();

// Constants
const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
// Middleware
app.use(cors()); //to send requests from different ip to the backend
app.use(express.json()); // send json from frontend to backend

// test connection initial route
// http://localhost:8800/
// app.get("/", (req, res) => {
//   return res.json({ message: "Connected!" });
// });

// Routes (part of middleware)
app.use("/api/auth", authRoute);

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
