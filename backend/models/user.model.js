import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String ,required:true, unique:true},
    email:{type:String ,required:true, unique:true},
    password:{type:String ,required:true, unique:true},
    profilePicture:{type:String ,default:""},
    coverPhoto:{type:String ,default:""},
    bio:{type:String ,default:""},
    gender:{type:String ,enum:['male','female']},
    friends:[{type:mongoose.Schema.Types.ObjectId ,ref:"User"}],
    posts:[{type:mongoose.Schema.Types.ObjectId ,ref:"Post"}],
    saved:[{type:mongoose.Schema.Types.ObjectId ,ref:"Post"}],
    blockedUsers:[{type:mongoose.Schema.Types.ObjectId ,ref:"User"}],
    sharedPost:[{type:mongoose.Schema.Types.ObjectId ,ref:"Post"}]
})
export const User = mongoose.model("User",userSchema)