import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { Post } from "../models/post.model.js"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing",
                success: false
            })
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                message: "Try different email.",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hashedPassword
        })

        return res.status(200).json({
            message: "Account created successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing",
                success: false
            })
        }

        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "User not registered.",
                success: false
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect Password",
                success: false
            })
        }

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);

                if (post.author.equals(user._id)) {
                    return post
                }
                return null
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilepicture: user.profilepicture,
            bio: user.bio,
            friends: user.friends,
            posts: populatedPosts
        }

        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `${user.username} Logged in successfully`,
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate([
            {
                path: "posts",
                populate: [
                    {
                        path: "author",
                        select: "username profilePicture"
                    },
                    {
                        path: "comments",
                        options: { sort: { createdAt: -1 } },
                        populate: {
                            path: "author",
                            select: "username profilePicture"
                        }
                    },
                    {
                        path: "reactions",
                        options: { sort: { createdAt: -1 } },
                        populate: {
                            path: "author",
                            select: "username profilePicture"
                        }
                    }
                ]
            },
            {
                path: "saved",
                populate: [
                    {
                        path: "author",
                        select: "username profilePicture"
                    },
                    {
                        path: "comments",
                        options: { sort: { createdAt: -1 } },
                        populate: {
                            path: "author",
                            select: "username profilePicture"
                        }
                    },
                    {
                        path: "reactions",
                        options: { sort: { createdAt: -1 } },
                        populate: {
                            path: "author",
                            select: "username profilePicture"
                        }
                    }
                ]
            },
            {
                path: "friends",
                select: "username profilePicture"
            }
        ]);

        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        const { bio, gender } = req.body;

        const profilePicture = req.files?.profilePicture?.[0]; // Extract first file
        const coverPhoto = req.files?.coverPhoto?.[0]; // Extract first file

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (bio) {
            user.bio = bio;
        }
        if (gender) {
            user.gender = gender;
        }
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture)
            const cloud_response = await cloudinary.uploader.upload(fileUri)
            user.profilePicture = cloud_response.secure_url;
        }
        if (coverPhoto) {
            const fileUri = getDataUri(coverPhoto)
            const cloud_response = await cloudinary.uploader.upload(fileUri)
            user.coverPhoto = cloud_response.secure_url;
        }

        await user.save();
        return res.status(200).json({
            message: "profile updated successfully!",
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
    }
}

export const SuggestedUser = async (req, res) => {
    try {
        const myId = req.id;
        const user = await User.findById(myId).select("friends")
        const friendsIds = user?.friends || [];

        const suggestedUsers = await User.find({
            _id: { $nin: [myId, ...friendsIds] } // Exclude myId and friends' IDs
        })
            .select("username profilePicture");

        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
}

export const friendOrUnfriend = async (req, res) => {

    try {
        const Me = req.id;
        const FriendTarget = req.params.id;

        if (Me === FriendTarget) {
            return res.status(400).json({
                message: 'You cannot friend/unfriend yourself',
                success: false
            });
        }

        const user = await User.findById(Me)
        const targetUser = await User.findById(FriendTarget)

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        const isFriend = user.friends.includes(FriendTarget)
        if (isFriend) {
            await Promise.all([
                User.updateOne({ _id: Me }, { $pull: { friends: targetUser } }),
                User.updateOne({ _id: targetUser }, { $pull: { friends: Me } }),
            ])
            return res.status(200).json({
                message: "Unfriend successfully",
                success: true
            })
        } else {
            await Promise.all([
                User.updateOne({ _id: Me }, { $push: { friends: targetUser } }),
                User.updateOne({ _id: targetUser }, { $push: { friends: Me } }),
            ])
            return res.status(200).json({
                message: "Friend successfully",
                success: true
            })
        }
    } catch (error) {
        console.log(error);
    }
}
