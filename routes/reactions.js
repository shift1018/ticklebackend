import { Router } from "express";
import { reactPost, getReactions } from "../controllers/reactions.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();


// Get all reactions by post id
//http://localhost:8800/api/reactions/reactPost
router.get("/getReactions/:id", checkAuth, getReactions);

// Save/uppdate reaction on post
//http://localhost:8800/api/reactions/reactPost
router.put("/reactPost", reactPost);


export default router;