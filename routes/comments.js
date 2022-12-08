import { Router } from 'express';
import { saveComment } from '../controllers/comments.js';
import { getComments } from '../controllers/comments.js';


const router = new Router();

//Save comment
// http://localhost:8800/api/comments/saveComment
router.post("/saveComment", saveComment);


//Get all comments
// http://localhost:8800/api/comments/getComments/id
router.get("/getComments/:id", getComments);

export default router;