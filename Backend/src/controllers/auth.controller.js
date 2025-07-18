import { ApiError } from "../lib/api.error.js"
import { ApiResponse } from "../lib/api.response.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { createStreamUser } from "../lib/streamChat.js"

import { streamChat } from "../lib/streamChat.js"

async function signup(req, res) {
    try {
        const { fullname, email, password } = req.body
        console.log(req.body)

        //validations
        if (!fullname || !email || !password) {
            return res
                .status(400)
                .json({message : "All feilds are requried"})
        }
        if (password.length < 6) {
            return res
                .status(401)
                .json({message : "Password must be at least 6 characters long"})
        }
        //email validation generated with AI
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({message :"invalid email format"});
        }

        //check if email already exists
        const user = await User.findOne({ email })

        if (user) {
            return res
                .status(400)
                .json( {message : "Email already exists ,Use a different email"})
        }

        //random image generation
        const imgNo = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${imgNo}.png`

        //creating user in database
        const newUser = await User.create({
            fullname,
            email,
            password,
            profilePic: randomAvatar
        })

        //creating user in streamchat
        try {
            await createStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullname,
                image: newUser.profilePic || ""
            })
            console.log("user created in streamchat")
        } catch (error) {
            console.log("error in creating user in streamchat", error)
        }

        //token generation
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        //token settings
        const options = {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        }

        return res
            .status(201)
            .cookie("jwt", token, options)
            .json({createdUser: newUser, token})
    }

    catch (err) {
        console.log("error in signup", err)
        return res.status(500).json({message : "Something went wrong"})
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({message : "All feilds are requried"})
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({message : "User not found"})
        }
        const isPasswordMatch = await user.isPasswordMatch(password)
        if (!isPasswordMatch) {
            return res.status(400).json({message : "Invalid credentials"})
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        const options = {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        }
        return res
            .status(200)
            .cookie("jwt", token, options)
            .json({ user, token , message : "Login successful"})

    } catch (error) {
        console.log("error in login", error)
        return res.status(500).json({message : "Something went wrong"})
    }
}


function logout(req, res) {
    try {
        res
            .status(200)
            .clearCookie("jwt")
            .json(new ApiResponse(200, null, "Logout successful"))

    } catch (error) {
        console.log("error in logout", error)
        return res.status(500).json(new ApiError(500, "Something went wrong"))
    }
}

async function onborad(req, res) {
    const userid = req.user._id
    if (!userid) {
        return res.status(400).json({message : "User not found" })
    }
    const { fullname, bio, location } = req.body
    console.log(req.body)
    if (!fullname || !bio || !location) {
        return res.status(400).json({message : "All fields are required"})
    }
    console.log(req.body)
    const updatedUser = await User.findByIdAndUpdate(userid, { ...req.body, isOnboarded: true }, { new: true })

    if (!updatedUser) {
        return res.status(400).json({message : "User not found"})
    }

    try {
        await streamChat.upsertUsers([{
            id: updatedUser._id.toString(),
            name: updatedUser.fullname,
            image: updatedUser.profilePic || "",
            bio : updatedUser.bio,
            location : updatedUser.location,
        }])
        console.log("user updated in streamchat")
    } catch (streamErr) {
        console.log("error in updating details in streamchat", streamErr)
    }
    return res.status(200).json({updatedUser})
}

export {
    signup,
    login,
    logout,
    onborad
}