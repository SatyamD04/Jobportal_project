
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
// import pkg from 'jsonwebtoken';
// const { jwt } = pkg;
import  jwt  from "jsonwebtoken";  // ---- throwing Syntax error
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// -------for user registeration------

export const register = async (req, res) => {
    try {
        //------for new user mendatory fields-----
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Please fill in all fields",
                success: false
            });
        };

        //-----cloudinary parts ----
        const file=req.file;
        const fileUri=getDataUri(file);
        const cloudResponse=await cloudinary.uploader.upload(fileUri.content);


        //----to check this email is already exist or not---
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User Email id already exist",
            })
        }

        //------for password hashing-----
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        })

        return res.status(201).json({
            message: "User Account created successfully",
            success: true,
        })
    }
    catch (error) {
        console.log(error);
    }
}

// ------ for user login ---------
export const login = async (req, res) => {
    try {
        //----to check the field is not empty-----
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

        //-----to check entered email is correct or not ------
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email",
                success: false
            })
        }

        //-----to check entered password is correct or not ------
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Password is incorrect",
                success: false,
            })
        }

        //-----checking selected role is correct or not ------
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role.",
                success: false,
            })
        }

        //------ generating token -------
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });//token generated

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profile: user.profile,
        }

        //----- storing token in Cookie -----                                        --sameSite:'strict' for security purpose
        return res.status(200).cookie('token', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome Back ${user.fullname}`,
            user,
            success: true
        })


    }
    catch (error) {
        console.log(error)
    }
}

//----- for user logout-----
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}

//----- for update user profile ------

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file=req.file;

        //---- cloudinary file part comes here---
        const fileUri=getDataUri(file);
        const cloudResponse=await cloudinary.uploader.upload(fileUri.content);

        // if (!fullname || !email || !phoneNumber || !bio || !skills) {
        //     return res.status(400).json({
        //         message: "Please fill all the fields, Something is missing",
        //         success: false,
        //     })
        // };

        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }

        const userId = req.id;   //---- value getting from middleware authentication--
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        //---- updating user data ----
        if(fullname) user.fullname=fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills=skillsArray;
        

        //---- resume comes here ---
        if(cloudResponse){
            user.profile.resume=cloudResponse.secure_url;//-----save cloudinary url-----
            user.profile.resumeOriginalName=file.originalname;//-----to save original resume file name------
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profile: user.profile,
        }
        return res.status(200).json({
            message: "Profile updated successfully",
            user,
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}