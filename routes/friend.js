import { Router } from 'express';

import { addFriend } from "../controllers/friends.js";
import { checkAuth } from '../utils/checkAuth.js';

const router = new Router();

// Register
router.post("/:id/addFriend", checkAuth, addFriend);

// Login 



// Get Me



export default router;