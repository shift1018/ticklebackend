
import Photo from "../models/Photos.js";
import User from "../models/Users.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { BlobServiceClient } from "@azure/storage-blob";
import Friendships from "../models/Friendships.js";


// get all photos
// export const getAll = async (req, res) => {
//     try {
      
//       const photos = await Photo.find().sort("-album");
//       if (!photos) {
//         return res.json({ message: "No photos" });
//       }
//       res.json(photos);
//     } catch (error) {
//       res.status(500).json({ message: "Something went wrong" });
//     }
//   };

// Get all photos of one user
export const getPhotosbyuserid = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      const photos = await Promise.all(
        user.photos.map((photo) => {
          return Photo.findById(photo._id);
          //  delete null
        })
      );
      res.status(200).json(photos);
    } catch (error) {
      res.status(500).json({ message: "Something went toooo wrong" });
    }
  };


// Get all albums of photos
export const getalbums = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const albums = await  Photo.find(
      {"user": user }
    ).distinct( "album");
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ message: "Something went toooo wrong" });
  }
};


  // Update photos
export const updatePhotos = async (req, res) => {
  try {
    const  _album = req.body.album;
    const idList= req.body.idList;

    idList.forEach(async element => {
      const photo = await Photo.findById(element);

    photo.album = _album;
    await photo.save();

    });
    

    // res.json(photo);
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};



export const getphotobyalbum = async (req, res) => {
  try {
    const getalbum= req.params.album;
    const user = await User.findById(req.userId);
    const photos = await  Photo.find(
          {"user": user,
          "album": getalbum}
        );
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: "Something went toooo wrong" });
  }
};
//。。。。。。。。。。。。。。deltet。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。
export const deleteiamges = async (req, res) => {
  try {
    const options = {
      deleteSnapshots: 'include' // or 'only'
    }

    const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
  
    await blockBlobClient.delete(options);
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: "Something went toooo wrong" });
  }
};


// async function deleteBlob(containerClient, blobName){

  
// }
