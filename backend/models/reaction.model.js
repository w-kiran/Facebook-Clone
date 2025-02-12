import mongoose from "mongoose";
const reactionSchema = new mongoose.Schema({
    reaction: { 
        type: String, 
        enum: ["like", "love", "haha", "sad", "angry", "wow"], 
        required: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }
});

export const Reactions = mongoose.model("Reactions",reactionSchema)