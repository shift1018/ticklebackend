import Post from "../models/Posts.js";
import Photo from "../models/Photos.js";
import User from "../models/Users.js";
import Friendship from "../models/Friendships.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { BlobServiceClient } from "@azure/storage-blob";
import Friendships from "../models/Friendships.js";

// Create post
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const user = await User.findById(req.userId);
    // console.log(req.userId);
    //  console.log(user);
    const urlList = [];
    if (req.files) {
      const file= req.files.fileName;
      
      //set azure environment : ConnectionString and ContainerName
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        "BlobEndpoint=https://tickle.blob.core.windows.net/;QueueEndpoint=https://tickle.queue.core.windows.net/;FileEndpoint=https://tickle.file.core.windows.net/;TableEndpoint=https://tickle.table.core.windows.net/;SharedAccessSignature=sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2022-12-23T10:48:40Z&st=2022-11-23T02:48:40Z&spr=https&sig=0n%2Bq%2FYphSP%2BSzLnv8v1VgCJDSHYjuS0X8VsGf8k23eE%3D"
        );
      const containerClient = blobServiceClient.getContainerClient("post");

      // put all the images into urlList
      file.forEach(element => {
        const fileName = element.name;
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const options = { blobHTTPHeaders: { blobContentType: element.type } };
        blockBlobClient.uploadData(element.data, options);
        // const response = await blockBlobClient.uploadFile(filePath);
        // https://tickle.blob.core.windows.net/post/download.jpg
        // https://tickle.blob.core.windows.net/post/az1.jpg

        const photoUrl = containerClient.getBlockBlobClient(fileName);
        urlList.push(photoUrl.url);
      });

      //create a new post
      const newPostWithImage = new Post({
        title,
        content,
        imageURL: urlList,
        tags,
        reactions: req.body.reactions,
        user: req.userId,
      });
      await newPostWithImage.save();

      // in the new post we create multiple images, their urls in the urlList, for each url we create a new image, the album default name is "albums", after creation we push images to user and post
      urlList.forEach(async element => {
          const newImage = new Photo({
          photoURL:element,
          album: "Albums",
          post: newPostWithImage._id,
          user: req.userId,
        });
        await newImage.save();

        //push photo into user table
        await User.findByIdAndUpdate(req.userId, {
        $push: { photos: newImage },
        });
        //push photo into Post table
        await Post.findByIdAndUpdate(newPostWithImage._id, {
          $push: {photos: newImage },
        });
      });

      

      //push post into user table
      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: newPostWithImage },
      });

      

      return res.json(newPostWithImage);
    }

    // console.log("!req.files");

    const newPostWithoutImage = new Post({
      title,
      content,
      imageURL: "",
      tags,
      reactions: req.body.reactions,
      user: req.userId,
    });

    // console.log(newPostWithoutImage);

    await newPostWithoutImage.save();

    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPostWithoutImage },
    });

    return res.json(newPostWithoutImage);
  } catch (error) {
    // console.log(object);
    res.json({ message: "Something went way wrong" });
  }
};

//Get all posts
export const getAll = async (req, res) => {
  try {
    // const posts = await Post.find().sort("-createdAt").populate("user").exec(); //detailed output with all user info
    const posts = await Post.find().sort("-createdAt");
    if (!posts) {
      return res.json({ message: "No posts" });
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Something went sooooo wrong" });
  }
};

//Get post by id
export const getById = async (req, res) => {
  try {
    const post = await Post.findOne(req.params._id);
    // const post = await Post.findById(req._id);
    res.json(post);
  } catch (error) {
    res.json({ message: "Something went realllly wrong" });
  }
};

// Get all posts of one user
export const getMyPosts = async (req, res) => {
  // console.log("jhgjhgjuser");
  try {
    const user = await User.findById(req.params.userId);

    console.log("user");

    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id);
      })
    );

    res.status(200).json(list);
  } catch (error) {
    res.status(500).json({ message: "Something went toooo wrong" });
  }
};

//-------------NEWLY ADDED ROUTES---------------//

// Get timeline posts for a user --> includes posts from that user and all their friends (friends posts NOT WORKING YET)
export const getTimelinePosts = async (req, res) => {
  console.log("timeline posts are active");
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ user: currentUser._id });

    // const friendPosts = await Promise.all(
    //   currentUser.friendships.map((friendship) => {
    //     console.log(friendship);

    // const friendList = await Promise.all(
    //   currentUser.friendships.map((friendship) => {
    //     // console.log(friendship);
    //     return Friendships.findById(friendship._id);
    //   })
    // );
    // console.log(friendList);
    // const friendPosts = await Post.find({ user: friendList[0].friend });
    // console.log(friendPosts);

    // const friendFinal = await Promise.all();

    // return friendship;

    // const friendId = Friendships.findById({ friendship: friendship._id });
    // console.log(friendId);

    // console.log({ friend: friendship.friendId });
    // friendship.friend.map(())

    // const postArray = Post.find({ user: friendship.friend._id });
    //  Post.findById({ user: friend._id });

    // console.log(postArray);

    // return Post.find(postArray);
    //   return postArray;
    // })

    /////////////////////////////////////////////////////////
    //  const user = await User.findById(req.params.userId);
    //console.log("currentUser111", currentUser);

    // const friendlist = await user.friendships.findOne(user.id == req.userId);

    //list of all friendships of one user from req
    const list = await Promise.all(
      currentUser.friendships.map((currentUser) => {
        return Friendship.findById(currentUser._id);
      })
    );

    let friendPosts = [];
    let friendasuser;

    for (let i = 0; i < list.length; i++) {
      if (list[i].approvedDate !== null) {
        // console.log("currentUser._id", currentUser.id);

        if (currentUser.id == list[i].user) {
          friendasuser = await User.findById(list[i].friend);
        } else {
          friendasuser = await User.findById(list[i].user);
        }

        const list2 = await Promise.all(
          friendasuser.posts.map((post) => {
            return Post.findById(post._id);
          })
        );

        friendPosts.push(...list2);
      }
    }
    // merge user Posts and friens Posts
    friendPosts.push(...userPosts);

    //remove nulls from array
    var friendsUserPostsFinal = friendPosts.filter(function (el) {
      return el != null;
    });

    //sorting posts by createDate (desc order)
    friendsUserPostsFinal.sort(
      (a, b) =>
        new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
    );
    //////////////////////////////////////////

    res.status(200).json(friendsUserPostsFinal);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong with get Timeline posts" });
  }
};

// Get user's ALL posts for Profile --> Only posts from that user (WORKING)
export const getProfilePosts = async (req, res) => {
  console.log("profile posts are active");
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ user: user._id });

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong with get Profile posts" });
  }
};

//-------------End of NEWLY ADDED ROUTES---------------//

// Remove post
export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.json({ message: "Cannot find the post" });

    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    });

    res.json({ message: "The post was removed" });
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    //console.log(title);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "uploads", fileName));
      post.imageURL = fileName || "";
    }

    post.title = title;
    post.content = content;
    //post.tags = tags;
    //post.reactions = req.body.reactions;
    //post.user = req.userId;

    await post.save();

    res.json(post);
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};
