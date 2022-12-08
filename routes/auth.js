import { Router } from 'express';
import { register, login, getUser } from "../controllers/auth.js";
import { checkAuth } from '../utils/checkAuth.js';
import { validation } from '../utils/validationMiddleware.js'; 
import { userRegSchema } from '../validations/userRegValidation.js';

const router = new Router();

// Register
// http://localhost:8800/api/auth/register
router.post("/register", validation(userRegSchema), register);

// Login 
// http://localhost:8800/api/auth/login
router.post("/login", login);

// Get User
//http://localhost:8800/api/auth/user
  // checkAauth is the middleware from utils folder
router.get("/user", checkAuth, getUser);


export default router;