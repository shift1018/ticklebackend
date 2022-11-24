import { Router } from "express";
import {
  createPost,
  getAll,
  getById,
  getMyPosts,
  removePost,
  updatePost,
} from "../controllers/posts.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

//Create post
// http://localhost:8800/api/posts
router.post("/", checkAuth, createPost);

// Get all posts
//http://localhost:8800/api/posts
router.get("/", getAll);

// Get post by id
//http://localhost:8800/api/posts/:id
router.get("/:id", getById);

// Update post
//http://localhost:8800/api/posts/:id
router.patch("/:id", checkAuth, updatePost);

// Get all user's Posts
// http://localhost:8800/api/posts/myPosts/
router.get("/user/my/", checkAuth, getMyPosts);

// Remove Post
// http://localhost:8800/api/posts/:id
router.delete("/:id", checkAuth, removePost);

export default router;
