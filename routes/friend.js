import { Router } from 'express';

import { addFriend, addApproveDate, getApprovedFriends, getNotApprovedFriends, deleteMyFriend, getFriendsFriend } from "../controllers/friends.js";
import { checkAuth } from '../utils/checkAuth.js';

const router = new Router();

// Register
//http://localhost:8800/api/friends/user/addFriend
router.post("/user/addFriend", checkAuth, addFriend);

// Get My Friends
//http://localhost:8800/api/friends/user/myFriends
router.get('/user/myFriends', checkAuth, getApprovedFriends);
//router.get('/myFriends/:id', checkAuth, getMyFriends);

// Get Not Approved Friends
//http://localhost:8800/api/friends/user/notApprFriends
 router.get('/user/notApprFriends', checkAuth, getNotApprovedFriends);


//http://localhost:8800/api/friends/user/approveDate
router.patch("/user/approveDate", checkAuth, addApproveDate);

//http://localhost:8800/api/friends/user/deleteFriend
router.delete("/user/deleteFriend/:id", checkAuth, deleteMyFriend);

// Get Friends of my friend
//http://localhost:8800/api/friends/hisFriends/:id
router.get('/hisFriends/:username', getFriendsFriend);
//router.get('/myFriends/:id', checkAuth, getMyFriends);

export default router;