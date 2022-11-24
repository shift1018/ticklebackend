import User from "../models/Users.js";
import Friendships from "../models/Friendships.js";

//follow a user
export const addFriend = async (req, res) => {
  //router.put("/:id/addFriend", async (req, res) => {
  // if (req.body.friend !== req.params.id) {
  if (req.body.friend !== req.userId) {
    try {
      const { friend, approvedDate } = req.body;

      const friendReq = await User.findById(req.body.friend);

      const currentUser = await User.findById(req.userId);

      const approval = req.body.approvedDate;

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
        console.log(list);
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
