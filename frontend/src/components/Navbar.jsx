import React, { useState } from "react";
import { Home, Video, ShoppingBag, Users, Bell, Search, Grid } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const { likeNotification } = useSelector(store => store.realTimeNotification)
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false)
    return (
        <nav className="bg-white shadow-md p-3 flex items-center justify-between">
            {/* Left Section: Logo and Search */}
            <div className="flex items-center space-x-3">
                <div className="text-blue-600 text-3xl font-bold">F</div>
                <div className="relative w-56 md:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search Facebook"
                        className="bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Middle Section: Navigation Icons */}
            <div className="flex space-x-20 justify-center pr-40">
                <button className="p-2 rounded-full hover:bg-gray-200" title="Home">
                    <Home size={22} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200" title="Videos">
                    <Video size={22} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200" title="Marketplace">
                    <ShoppingBag size={22} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200" title="Groups">
                    <Users size={22} />
                </button>
            </div>

            {/* Right Section: Menu, Notifications, and Avatar */}
            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-gray-200" title="Menu">
                    <Grid size={22} />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-200" title="Notifications">
                    <Bell size={22} />
                </button>
                <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
};

export default Navbar;
