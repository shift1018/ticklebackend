import Post from "../models/Posts.js";
import Photo from "../models/Photos.js";
import User from "../models/Users.js";
import Friendship from "../models/Friendships.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { BlobServiceClient } from "@azure/storage-blob";
import Friendships from "../models/Friendships.js";

import Reactions from "../models/Reactions.js";



export const getReactions = async (req, res) => {
    try {
        const reactionsArray = await Reactions.find({post: req.params.id});
        // console.log("Reacts back after query", reactions);

        const newReactions = reactionsArray.reduce((group, react)=>{
            let key = react.reaction;
            //check if key exists or not option 1
            // if(!group[key]){
            //     group[key] = [];
            // } 
            //check if key exists or not option 2           
            group[key] = group[key] || [];
            // creates an array of all the same reactions with the name based on react.reaction
            group[key].push(react);
            return group;
        }, {});
        //console.log(newReactions)

        //calculate total number of reactions by each reaction
        const reactions = [
            {
                react: "like",
                count: newReactions.like ? newReactions.like.length : 0,
            },
            {
                react: "love",
                count: newReactions.love ? newReactions.love.length : 0,
            },
            {
                react: "haha",
                count: newReactions.haha ? newReactions.haha.length : 0,
            },
            {
                react: "sad",
                count: newReactions.sad ? newReactions.sad.length : 0,
            },
            {
                react: "wow",
                count: newReactions.wow ? newReactions.wow.length : 0,
            },
            {
                react: "angry",
                count: newReactions.angry ? newReactions.angry.length : 0,
            },
        ];

        const check = await Reactions.findOne({
            post: req.params.id,
            reactionBy: req.userId,
        });
        //console.log(check);
        res.json({
            //reactionsArray,
            reactions,
            // having ? avoids error because it can be undefined
            check: check?.reaction,
            total: reactionsArray.length,
        })
    }catch (error){
        return res.status(500).json({message: error.message});
    }
}



export const reactPost = async (req, res) => {
    try {
        const {postId, userId, reaction} = req.body;
        // query to check if the reaction for this user and post already exists
        const check = await Reactions.findOne({
            post: postId,
            reactionBy: userId,
        });
        // if reaction doesn't exist save it to db
        // if reaction clicked is the same that exists in db remove it from db
        // if reaction clicked is different from the existing one - update it
        if(check==null){
            const newReaction = new Reactions({
                reaction: reaction,
                post: postId,
                reactionBy: userId,
            });
            await newReaction.save();
        }else {
             if(check.reaction == reaction){
                await Reactions.findByIdAndRemove(check._id);
            }else {
                await Reactions.findByIdAndUpdate(check._id, {
                    reaction: reaction,
                });
            }
        }
    } catch (error){
        return res.status(500).json({message: error.message});
    }

}