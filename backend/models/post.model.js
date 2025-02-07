import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption:{type:String,default:""},
    image:{type:String,default:""},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    reactions:[{type:mongoose.Schema.Types.ObjectId,ref:"Reactions"}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comment"}],
})
export const Post = mongoose.model("Post",postSchema);