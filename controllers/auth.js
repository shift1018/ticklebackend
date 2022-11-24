import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import { response } from "express";
import jwt from "jsonwebtoken";


// Register user
export const register = async (req, res) => {
    try {
        const { username, email, password, avatarURL } = req.body;

        const isUsed = await Users.findOne({ email });
        if(isUsed) {
            return res.json({
                message: "This email is already used"
            })
        }
        // (10) means level of difficulty of hashing
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new Users({
            username,
            email,
            password: hash,
            avatarURL
        }) 

        await newUser.save();
        res.json({
            newUser, message: "Registration successful"
        })

    }catch (error){
        res.json({ message: "User registration error" })
    }
}



// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email })
        
        // Check if user already exists in the db
        if(!user){
            return res.json({
                message: "User with this email does not exist"
            })
        }

        // Check if password is correct
        const isPassCorrect = await bcrypt.compare(password, user.password);
        if(!isPassCorrect){
            return res.json({
                message: "Password is wrong"
            }) 
        }

        // Authorization (create accessToken to check if user is logged in based on jasonwebtoken package)
        const accessToken = jwt.sign(
            {
                id: user._id,
                username: user.username, 
                role: user.role,
                email: user.email
            }, 
            // get a secret phrase from .env file (can be any manually created there) which is needed to read the token after crypting
            process.env.JWT_SECRET,
            { expiresIn: "30d" },
        )

        res.json({
            token: accessToken, 
            user, 
            message: "You're logged in"
        })


    }catch(error){
        res.json({ message: "Login error" })
    }
}


// Get user 
// (used to stay logged in in when the page is refreshed)
export const getUser = async (req, res) => {
    try{
        const user = await Users.findById(req.userId);

        if(!user){
            return res.json({
                message: "User does not exist"
            })
        }
        // create a token again, always based on id, that's why it'll be the same
        const accessToken = jwt.sign(
            {
                id: user._id,
                username: user.username, 
                role: user.role,
                email: user.email
            }, 
            process.env.JWT_SECRET,
            { expiresIn: "30d" },
        )

        res.json({
            token: accessToken,
            user  
        })

    }
    catch(error){
        res.json({ message: "Access denied" })
    }
}

