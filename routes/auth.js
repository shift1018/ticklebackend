import { Router } from 'express';
import { register, login, getUser } from "../controllers/auth.js";
import { checkAuth } from '../utils/checkAuth.js';

const router = new Router();

// Register
// http://localhost:8800/api/auth/register
router.post("/register", register);

// Login 
// http://localhost:8800/api/auth/login
router.post("/login", login);

// Get User
//http://localhost:8800/api/auth/user
  // checkAauth is the middleware from utils folder
router.post("/user", checkAuth, getUser);


export default router;