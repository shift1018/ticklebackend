import User from "../models/Users.js";
import Friendships from "../models/Friendships.js";

//follow a user
export const addFriend = async (req, res) => {
  //router.put("/:id/addFriend", async (req, res) => {
  // if (req.body.friend !== req.params.id) {
  if (req.body.friend !== req.userId) {
    try {
      const { friend } = req.body;

      const friendReq = await User.findById(req.body.friend);

      const currentUser = await User.findById(req.userId);

      //const approval = req.body.approvedDate;
     const approval = "";
      // console.log("User ", req.body.approvedDate);

      const newFriendship = new Friendships({
        user: currentUser._id,
        friend: friendReq._id,
        approvedDate: approval,
      });
      //approvedDate:approval,

      const list = await Promise.all(
        currentUser.friendships.map((currentUser) => {
          return Friendships.findById(currentUser._id);
        })
      );
       // console.log(list);
      let hasFriend = false;

      // if(currentUser.friendships.length !== 0){
      // const list = await Promise.all(
      //   currentUser.friendships.map((currentUser) => {
      //     return Friendships.findById(currentUser._id);
      //   })
      // );

      if (list.length !== 0) {
        for (let i = 0; i < list.length; i++) {
          if (
            (list[i].user == currentUser.id &&
              list[i].friend == friendReq.id) ||
            (list[i].user == friendReq.id && list[i].friend == currentUser.id)
          ) {
            hasFriend = true;
            break;
            //return res.status(403).json("you allready have this friend");
          } else {
            hasFriend = false;
          }
        }
      } else {
        hasFriend = false;
      }

      if (hasFriend) {
        return res.status(403).json("you already have this friend");
      } else {
        await newFriendship.save();
        await friendReq.updateOne({
          $push: { friendships:newFriendship },
        });
        await currentUser.updateOne({
          $push: { friendships:newFriendship },
        });
        return res.status(200).json("A friend was added");
      }
    } catch (err) {
      res.json({ message: "Error when adding a friend" });
    }
  } else {
    res.status(403).json("you cant add yourself as a friend");
  }
};

// Get Friends By Users Id
export const getApprovedFriends = async (req, res) => {
  try {
   const user = await User.findById(req.userId);
   //const user = await User.findById(req.params.id);
    // console.log(user.news())
    const list = await Promise.all(
      user.friendships.map((friendships) => {
        return Friendships.findById(friendships._id);
      })
    );

    const friends = [];
  //   for( let i = 0; i<list.length; i++){
  //     if(list[i].user != user.id){
  //   friends[i]=list[i].user;}
  //  else {
  //   friends[i]=list[i].friend;
  //   }
  //   }

    for( let i = 0; i<list.length; i++){
      if(list[i].approvedDate!==null){
      if(list[i].user != user.id){
    friends[i]=await User.findById(list[i].user);}
   else {
    friends[i]=await User.findById(list[i].friend);
    }
  }
    }
    
    var friendsFinal = friends.filter(function (el) {
      return el != null;
    });


    res.json(friendsFinal);
   //res.json(list);
  } catch (error) {
    res.json({ message: "Something going wrong" });
  }
};


// Get not approved Friends By Users Id
export const getNotApprovedFriends = async (req, res) => {
  try {
   const user = await User.findById(req.userId);
   //const user = await User.findById(req.params.id);
    // console.log(user.news())

    const list = await Promise.all(
      user.friendships.map((friendships) => {
        return Friendships.findById(friendships._id);
      })
    );
   

    const friends = [];

     for( let i = 0; i<list.length; i++){
      if(list[i].approvedDate==null){
      if(list[i].user != user.id){
     friends[i]=await User.findById(list[i].user);}
  //  else {
   // friends[i]=await User.findById(list[i].friend);
    }
  }
  

    var friendsFinal = friends.filter(function (el) {
      return el != null;
    });


    res.json(friendsFinal);
   //res.json(list);
  } catch (error) {
    res.json({ message: "Something going wrong" });
  }
};


//Edit News By Users Id and News Id
export const addApproveDate = async (req, res) => {
  try {
    const {friend} = req.body;

    const friendReq = await User.findById(req.body.friend);
    const currentUser = await User.findById(req.userId);
   // const approval = req.body.approvedDate;

    const list = await Promise.all(currentUser.friendships.map((currentUser) => {
        return Friendships.findById(currentUser._id);
      })
    );
  
      for (let i = 0; i < list.length; i++) {
        if (
          (list[i].user == currentUser.id && list[i].friend == friendReq.id) ||
          (list[i].user == friendReq.id && list[i].friend == currentUser.id)) {
           // console.log("Friend", list[i].friend);
            if(list[i].approvedDate ==null){
              list[i].approvedDate = Date.now();
              await list[i].save();
              res.json("request aprroved");
              break;
            }else{
              res.json("nothing to approve");
              break;
            }
        }

      }
  
  } catch (err) {
    res.json({ message: "Error when editting a friendship" });
  }

};


//Delete News By Users Id and News Id
export const deleteMyFriend = async (req, res) => {
  try {
    // const {friend} = req.params.id;

    const friendReq = await User.findById(req.params.id);
    //console.log("friend id", req.params.id);
    const currentUser = await User.findById(req.userId);
   // const approval = req.body.approvedDate;

    const list = await Promise.all(currentUser.friendships.map((currentUser) => {
        return Friendships.findById(currentUser._id);
      })
    );
  
      for (let i = 0; i < list.length; i++) {
        if (
          (list[i].user == currentUser.id && list[i].friend == friendReq.id) ||
          (list[i].user == friendReq.id && list[i].friend == currentUser.id)) {
             //const friendship = await Friendships.findById(list[i]);
            
            const deletefriendship = await Friendships.findByIdAndDelete(list[i]._id);
           // console.log(deletefriendship);
            
            await friendReq.updateOne({
              $pull: { friendships: list[i]._id },
            });
            await currentUser.updateOne({
              $pull: { friendships: list[i]._id },
            });
            res.json({ message: "Your friend was deleted." });
          }
                       
        }

  // try {
  //   const friends = await Friendships.findByIdAndDelete(req.params.id);
  //   if (!friends) return res.json({ message: "This news does not exist" });

  //   await User.findByIdAndUpdate(req.userId, {
  //     $pull: { friends: req.params.id },
  //   });

  //   res.json({ message: "Your friend was deleted." });
  // } catch (error) {
  //   res.json({ message: "Something went wrong." });
  // }

} catch (err) {
  res.json({ message: "Error when deleting a friendship" });
}
};


//Get Friends of a friend

export const getFriendsFriend = async (req, res) => {
  try {
   // console.log("username from profile", req.params.username)
     const username = req.params.username;

    if(username !== "undefined"){
     
     const friend = await User.findOne({ username: username });
     
    const list = await Promise.all(
      friend.friendships.map((friendships) => {
        return Friendships.findById(friendships._id);
      })
    );

    const friends = [];
 
    for( let i = 0; i<list.length; i++){
      if(list[i].approvedDate!==null){
      if(list[i].user != friend.id){
    friends[i]=await User.findById(list[i].user);}
   else {
    friends[i]=await User.findById(list[i].friend);
    }
  }
    }
    
    var friendsFinal = friends.filter(function (el) {
      return el != null;
    });

    res.json(friendsFinal);
   }
   //res.json(list);
  } catch (error) {
    res.json({ message: "Something going wrong" });
  }
};





