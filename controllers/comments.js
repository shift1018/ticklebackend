import Comments from "../models/Comments.js";
import Posts from "../models/Posts.js";
import Users from "../models/Users.js";


export const saveComment = async (req, res) => {
  // getting comment data from frontend (from req.body)
  const comment = new Comments(req.body);

  // saving the comment to db
  comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    // finding the comment from db to get user from it to be able to use
    // populate function to get all the data about the user
    Comments.find({ _id: comment._id })
      .populate("user")
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
  await Posts.findByIdAndUpdate(req.body.post, {
    $push: { comments: comment },
  });
  await Users.findByIdAndUpdate(req.body.user, {
    $push: { comments: comment },
  });
};

// export const getComments = async (req, res) => {
//     // postId comes from the frontend in the request
//     console.log(req.body.postId);
//     Comments.find({"post": req.body.postId})
//     .populate("user")
//     // call it as comments in the parameters of .exec to send it to frontend as the response
//     .exec((err, comments) => {
//         if(err) return res.status(400).send(err)
//         res.status(200).json({ success:true, comments })
//     })
// }

export const getComments = async (req, res) => {
    
  try {
    //const {post} = req.body;
    //console.log("this is postID", req.params.id);
    const p = await Posts.findById(req.params.id);

   //console.log("this is post", p);

    const list = await Promise.all(
        p.comments.map((c) => {
        return Comments.findById(c._id);
      })
    );

    res.json(list);
  } catch (error) {
    res.json({ message: "Something went wrong" });
  }
};
