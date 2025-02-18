import express from "express";
import { register,login, logout, getProfile, editProfile, SuggestedUser, friendOrUnfriend, searchUsers, deleteAccount, blockUsers, mutualFriends, getAllUsers, getFriends } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js"

const router = express.Router()

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuth,getProfile);
router.route('/profile/:id/editprofile').post(isAuth,upload.fields([{ name: "profilePicture", maxCount: 1 },{ name: "coverPhoto", maxCount: 1 }]),editProfile);
router.route('/suggested').get(isAuth,SuggestedUser)
router.route('/getallusers').get(isAuth,getAllUsers)
router.route('/friendorunfriend/:id').get(isAuth,friendOrUnfriend)
router.route('/friends').get(isAuth,getFriends)
router.route('/deleteaccount').delete(isAuth,deleteAccount)
router.route('/blockuser').post(isAuth,blockUsers)
router.route('/mutualfriend/:id').get(isAuth,mutualFriends)
router.route('/search').post(isAuth,searchUsers)

export default router