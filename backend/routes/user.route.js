import express from "express";
import { register,login, logout, getProfile, editProfile, SuggestedUser, friendOrUnfriend, searchUsers, deleteAccount, blockUsers, mutualFriends } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js"

const router = express.Router()

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuth,getProfile);
router.route('/profile/:id/editprofile').post(isAuth,upload.fields([{ name: "profilePicture", maxCount: 1 },{ name: "coverPhoto", maxCount: 1 }]),editProfile);
router.route('/suggested').get(isAuth,SuggestedUser)
router.route('/friendorunfriend/:id').get(isAuth,friendOrUnfriend)
router.route('/deleteaccount').delete(isAuth,deleteAccount)
router.route('/blockuser').post(isAuth,blockUsers)
router.route('/mutualfriend').get(isAuth,mutualFriends)
router.route('/search').post(isAuth,searchUsers)

export default router