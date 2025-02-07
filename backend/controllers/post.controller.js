import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js"
import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js";
import { Reactions } from "../models/reaction.model.js";

export const addNewPost = async (req, res) => {
    try {
        const userId = req.id;
        const caption = req.body;
        const image = req.file;

        if (!image && !caption) {
            return res.status(201).json({
                message: "Image and caption not found",
                success: false
            })
        }

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg,base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri)
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: userId
        })

        const user = await User.findById(userId)
        if (user) {
            user.posts.push(post._id)
            await user.save()
        }

        await post.populate({
            path: 'author',
            select: 'username profilePicture'
        })

    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        if (posts) {
            await posts.populate([{
                path: 'author',
                select: "username profilePicture"
            },
            {
                path: "comments reactions",
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: "author",
                    select: "username profilePicture"
                }
            }
            ])
        }
    } catch (error) {
        console.log(error);
    }
}

export const postReactions = async (req, res) => {
    try {
        const userId = req.id
        const postId = req.params.id;
        const post = await Post.findById(postId)
        const reactionType = req.body;
        if (!post) {
            return res.status(401).json({
                message: "Post not found",
                success: false
            })
        }

        const existingReaction = await Reactions.findOne({ author: userId, post: postId });
        if (existingReaction) {
            if(existingReaction.type === reactionType){
                await post.reactions.pull(existingReaction._id)
                await post.save();
                return res.status(200).json({
                    message: "Reaction removed",
                    success: true
                });
            }
            else{
                existingReaction.type = reactionType
                await existingReaction.save()
                return res.status(200).json({
                    message: "Reaction updated",
                    success: true,
                    reaction: existingReaction
                });
            }
            }
            await post.updateOne({
                _id: postId
            }, {
                $push: {
                    reaction: userId
                }
            })
            

        
        // await post.updateOne({ $addToSet: { reactions: userId } })

        const reaction = await Reactions.create({
            type:reactionType,
            author: userId,
            post: postId
        })

        await reaction.populate({
            path: 'author',
            select: "username profilePicture"
        })

        post.reactions.push(reaction._id)
        await post.save()

    } catch (error) {
        console.log(error);
    }
}