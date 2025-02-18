import React, { useState, useEffect } from "react";
import { Home, Video, ShoppingBag, Users, Bell, Search, Grid } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../configURL";
import { Input } from "./ui/input";
import { toast } from "sonner";

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [inputSearch, setInputSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Debounce effect to reduce API calls while typing
    useEffect(() => {
        const delay = setTimeout(() => {
            if (inputSearch.trim()) {
                fetchSearchResults(inputSearch);
            } else {
                setSearchResults([]);
            }
        }, 300); // Delay API call by 300ms

        return () => clearTimeout(delay);
    }, [inputSearch]);

    const fetchSearchResults = async (query) => {
        setLoading(true);
        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/user/search`,
                { searchRes: query },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            setSearchResults(res.data.searchResults);
        } catch (error) {
            toast.error("Error fetching users");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const navbarHandler = (name) => {
        if (name === "home") {
          navigate("/");
        } else if (name === "friends") {
          navigate("/friends");
        } else if (name === "video") {
          navigate("/video");
        } else if (name === "marketplace") {
          navigate("/marketplace");
        } else if (name === "game") {
          navigate("/game");
        }
      };

    return (
        <nav className="bg-white shadow-md p-3 flex items-center justify-between sticky top-0 z-50">
            {/* Left Section: Logo and Search */}
            <div className="flex items-center space-x-3">
                <img src="/fb.png" alt="logo" width={40} />
                <div className="relative w-56 md:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={inputSearch}
                        onChange={(e) => setInputSearch(e.target.value)}
                        className="w-64 border p-2 rounded-md pl-10"
                    />
                    {/* Display Search Results */}
                    {inputSearch.trim() && (
                        <div className="absolute bg-white shadow-md mt-2 w-full max-h-60 overflow-y-auto border rounded-md z-20">
                            {loading ? (
                                <p className="text-gray-500 p-2">Loading...</p>
                            ) : (
                                searchResults.length > 0 ? (
                                    searchResults.map((user) => (
                                        <div
                                            key={user._id}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => navigate(`/profile/${user._id}`)}
                                        >
                                            <Avatar>
                                                <AvatarImage src={user.profilePicture} />
                                                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.username}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 p-2">No users found</p>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Section: Navigation Icons */}
            <div className="flex space-x-20 justify-center pr-40">
                <button onClick={()=>navbarHandler("home")} className="p-2 rounded-full hover:bg-gray-200" title="Home">
                    <Home size={22} />
                </button>
                <button onClick={()=>navbarHandler("video")} className="p-2 rounded-full hover:bg-gray-200" title="Videos">
                    <Video size={22} />
                </button>
                <button onClick={()=>navbarHandler("marketplace")}  className="p-2 rounded-full hover:bg-gray-200" title="Marketplace">
                    <ShoppingBag size={22} />
                </button>
                <button onClick={()=>navbarHandler("friends")}  className="p-2 rounded-full hover:bg-gray-200" title="Groups">
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
