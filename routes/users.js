import { Router } from "express";
import { byId, updateUser, deleteUser } from "../controllers/users.js";
// import { updateUser } from "../controllers/users.js";
// import { deleteUser } from "../controllers/users.js";
// import { checkAuth } from '../utils/checkAuth.js';

const router = new Router();

// http://localhost:8800/users/byId/123
router.get("/byId/:id", byId);

// http://localhost:8800/users/update/123
router.put("/update/:id", updateUser);

// http://localhost:8800/users/delete/123
router.delete("/delete/:id", deleteUser);

// http://localhost:8800/users/follow/123
// router.put("/follow/:id", followUser);

// http://localhost:8800/users/unfollow/123
// router.put("/unfollow/:id", unfollowUser);

export default router;
