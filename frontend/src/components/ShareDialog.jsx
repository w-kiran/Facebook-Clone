import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Smile } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "../../configURL";
import { setPosts } from "@/redux/postSlice";

const ShareDialog = ({ openShare, setOpenShare }) => {
    const [caption, setCaption] = useState("");
    const { user } = useSelector((state) => state.auth);
    const { selectedPost, posts } = useSelector(store => store.post);
    const [visibility, setVisibility] = useState("public");
    const dispatch = useDispatch();


    const shareHandlerSend = async () => {
        if (!selectedPost?._id) {
            toast.error("No post selected for sharing!");
            return;
        }
        try {
            if (!selectedPost.originalPost) {
                const res = await axios.post(
                    `${BACKEND_URL}/api/v1/post/${selectedPost._id}/share`,
                    { caption, visibility },
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setPosts([...posts, res.data.sharedPost]));
                    toast.success("Post shared successfully!");
                    setOpenShare(false);
                }
            }else{
                const res = await axios.post(
                    `${BACKEND_URL}/api/v1/post/${selectedPost.originalPost._id}/share`,
                    { caption, visibility: "public" },
                    { withCredentials: true }
                );

                if (res.data.success) {
                    dispatch(setPosts([...posts, res.data.sharedPost]));
                    toast.success("Post shared successfully!");
                    setOpenShare(false);
                }
            }

        } catch (error) {
            console.error("Error sharing post:", error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    };


    return (
        <Dialog open={openShare} onOpenChange={setOpenShare}>
            <DialogContent className="max-w-md p-4 rounded-lg">
                {/* Header */}
                <DialogHeader className="flex justify-between items-center border-b pb-2">
                    <DialogTitle className="text-lg font-semibold">Share</DialogTitle>
                    <button onClick={() => setOpenShare(false)} className="p-2 hover:bg-gray-200 rounded-full">
                        <X size={20} />
                    </button>
                </DialogHeader>

                {/* Profile Section */}
                <div className="flex items-center gap-3 mt-3">
                    <img
                        src={user?.profilePicture || "https://via.placeholder.com/40"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <h1 className="font-semibold text-sm">{user?.username}</h1>
                        <span className="text-gray-500 text-xs">Visibility:</span>
                        <select
                            className="text-gray-500 text-xs mx-2 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="friends">Friends</option>
                        </select>
                    </div>
                </div>

                {/* Caption Input */}
                <textarea
                    placeholder="Say something about this..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full mt-3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>

                {/* Emoji & Share Now Button */}
                <div className="flex justify-between items-center mt-3">
                    <button className="p-2 hover:bg-gray-200 rounded-full">
                        <Smile size={20} />
                    </button>
                    <button onClick={shareHandlerSend} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Share now
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareDialog;
