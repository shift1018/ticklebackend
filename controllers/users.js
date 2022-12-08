import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import { response } from "express";
import jwt from "jsonwebtoken";
import Friendships from "../models/Friendships.js";
import { BlobServiceClient } from "@azure/storage-blob";
import { fileURLToPath } from "url";

// Find user by ID
export const byId = async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await Users.findById(userId)
      : await Users.findOne({ username: username });
    // NOT sending password or role
    const { password, role, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    return res.status(404).json({message: "this user does not exist!" });
  }
};

// Update User
export const updateUser = async (req, res) => {
 // const userId = req.body.userId;
  const userId = req.userId;
  // console.log(userId);
  const id = req.params.id;
  // console.log(id);
  const username = req.body.username;
  // console.log(username);
  // const email = req.body.email;
  // console.log(email);
  // const role = req.body.role;
  // console.log(role);
  const password = req.body.password;
  // console.log(password);
  //.............................upload avatar..................................

  const city = req.body.city;
  // console.log(city);
  const from = req.body.from;
  // console.log(from);
  const birthday = req.body.birthday;
  // console.log(birthday);
  const desc = req.body.desc;
  // console.log(desc);
  // console.log(req.body);
  let avatarURL= req.body.avatarURL;
  let profileURL= req.body.profileURL;

      
  //set azure environment : ConnectionString and ContainerName
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    "BlobEndpoint=https://tickle.blob.core.windows.net/;QueueEndpoint=https://tickle.queue.core.windows.net/;FileEndpoint=https://tickle.file.core.windows.net/;TableEndpoint=https://tickle.table.core.windows.net/;SharedAccessSignature=sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2022-12-23T10:48:40Z&st=2022-11-23T02:48:40Z&spr=https&sig=0n%2Bq%2FYphSP%2BSzLnv8v1VgCJDSHYjuS0X8VsGf8k23eE%3D"
  );
  const containerClient = blobServiceClient.getContainerClient("post");

  // put all the images into urlList
  //..............................................................................

  if (req.files!== null){
if (req.files!== null && Array.isArray(req.files)  ) {
  req.files.forEach(element => {
    const imageName = element.name;
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);
    const options = { blobHTTPHeaders: { blobContentType: element.type } };
    blockBlobClient.uploadData(element.data, options);
  if (element== "fileName") {
    avatarURL = containerClient.getBlockBlobClient(imageName).url;

  } else {
    profileURL = containerClient.getBlockBlobClient(imageName).url;
  }
  });
}else if(req.files.fileName){
  const imageName = req.files.fileName.name;
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);
    const options = { blobHTTPHeaders: { blobContentType: req.files.fileName.type } };
    blockBlobClient.uploadData(req.files.fileName.data, options);
    avatarURL = containerClient.getBlockBlobClient(imageName).url;
}else{
  const imageName = req.files.fileNameb.name;
  const blockBlobClient = containerClient.getBlockBlobClient(imageName);
  const options = { blobHTTPHeaders: { blobContentType: req.files.fileNameb.type} };
  blockBlobClient.uploadData(req.files.fileNameb.data, options);

  profileURL = containerClient.getBlockBlobClient(imageName).url;
}
}
//..............................................................................
  // if (req.files.fileName) {
  //   const fileName = req.files.fileName.name;
  //   const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  //   const options = { blobHTTPHeaders: { blobContentType: req.files.fileName.type } };
  //   blockBlobClient.uploadData(req.files.fileName.data, options);
  //   // const response = await blockBlobClient.uploadFile(filePath);
  //   // https://tickle.blob.core.windows.net/post/download.jpg
  //   // https://tickle.blob.core.windows.net/post/az1.jpg
  
  //   avatarURL = containerClient.getBlockBlobClient(fileName).url;
  // }
  // if (req.files.fileNameb) {
  //   const fileNameb = req.files.fileNameb.name;
  //   const blockBlobClientb = containerClient.getBlockBlobClient(fileNameb);
  //   const optionsb = { blobHTTPHeaders: { blobContentType: req.files.fileNameb.type } };
  //   blockBlobClientb.uploadData(req.files.fileNameb.data, optionsb);
  //   // const response = await blockBlobClient.uploadFile(filePath);
  //   // https://tickle.blob.core.windows.net/post/download.jpg
  //   // https://tickle.blob.core.windows.net/post/az1.jpg
  
  //   profileURL = containerClient.getBlockBlobClient(fileNameb).url;



  // }

  
  


  // if (userId === id || role == "Admin") {
    if (userId === id || role === "User") {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      } catch (err) {
        return res.status(500).json("Password error");
      }
    }
    try {
      const user = await Users.findByIdAndUpdate(id, 
        // { $set:req.body,avatarURL: avatarURL},
        { avatarURL: avatarURL,
          profileURL: profileURL,
          username: username,
          city: city,
          from: from,
          birthday: birthday,
          desc: desc,
      },
        
      
      );
     // console.log(user);
      res.status(200).json({ message: "User has been updated!" });
    } catch (err) {
      return res.status(500).json("User update error");
    }
  } else {
    return res
      .status(403)
      .json({ message: "you can only update your own account!" });
  }
};



// Delete User
export const deleteUser = async (req, res) => {
  const userId = req.userId;
  const id = req.params.id;
  // const role = req.body.role;

  if (userId === id) {
    try {
      const user = await Users.findByIdAndDelete(id);
      res
        .status(200)
        .json({ message: "Your account has been deleted successfully" });
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json({ message: "you can only delete your own account!" });
  }
};

//Get all users
export const getAllUsers = async (req, res) => {
  try {
    // const posts = await Post.find().sort("-createdAt").populate("user").exec(); //detailed output with all user info
    const users = await Users.find();
    

    const currentUser = await Users.findById(req.userId);
    
     const list = await Promise.all(
      currentUser.friendships.map((friendships) => {
         return Friendships.findById(friendships._id);
       })
     );
 
     const friends = [];
     for(let i=0; i<list.length; i++){
      if(list[i].user != currentUser.id){
        // friends[i]= await Users.findById(list[i].user)}
        friends[i]=list[i].user.toString();
      }else {
        // friends[i]=await Users.findById(list[i].friend);
        friends[i]=list[i].friend.toString();
        }
     }

     const allUsersIds = [];

     for(let i=0; i<users.length; i++){
     allUsersIds[i]=users[i]._id.toString();

     }

 

      for (var i = allUsersIds.length - 1; i >= 0; i--) {
        for (var j = 0; j <friends.length; j++) {
          if (allUsersIds[i] === friends[j]||allUsersIds[i] === currentUser.id) {
            allUsersIds.splice(i, 1);
            }
          }
        }

        const notFriends = [];
        for(let i=0; i<allUsersIds.length; i++){
          notFriends[i]= await Users.findById(allUsersIds[i])
        }
        

    res.json(notFriends);
  } catch (error) {
    res.status(500).json({ message: "Something went sooooo wrong" });
  }
};



export const updateBackground = async (req, res) => {



}
