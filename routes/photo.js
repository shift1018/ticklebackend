import { Router } from "express";
import {
//   createPost,
  // getAll,
  getPhotosbyuserid,
   getphotobyalbum,
   getalbums,
//   getProfilePosts,
//   removePost,
  updatePhotos,
} from "../controllers/photos.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

// Get all user's photos
//http://localhost:8800/api/photos
// router.get("/", checkAuth, getAll);

// Get my photos
// http://localhost:8800/api/photos/myphoto
router.get("/myphoto/", checkAuth, getPhotosbyuserid);


// Get photos by album name
//http://localhost:8800/api/photos/getphotobyalbum/:album
router.get("/getphotobyalbum/:album", checkAuth, getphotobyalbum);


// Get all albums of photos
//http://localhost:8800/api/photos/getalbums
router.get("/getalbums/", checkAuth, getalbums);

// update photos album
//http://localhost:8800/api/photos/updatephotos/
router.patch("/updatephotos/", checkAuth, updatePhotos);



export default router;