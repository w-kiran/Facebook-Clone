import React, { useState, useEffect } from "react";
import { Home, Video, ShoppingBag, Users, Bell, Search, Grid, HelpCircle, Settings, LogOut } from "lucide-react";
import { IoHomeOutline, IoNotifications } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa6";
import { FaFacebookMessenger } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../configURL";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { MdDelete } from "react-icons/md";
import { setPosts } from "@/redux/postSlice";
import { setAllUser, setAuthUser, setSuggestedUsers, setUserFriend, setUserSavedPost } from "@/redux/authSlice";
import { Button } from "./ui/button";
import { setNotification } from "@/redux/rtnSlice";
import logo from "/fb.png"

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [inputSearch, setInputSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { notification } = useSelector((store) => store.rtn);
    const [openProfile, setOpenProfile] = useState(false)
    const [settingOpen, setSettingOpen] = useState(false)


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

    const passwordHandler = async () => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/user/changepassword`, {
                oldPassword, newPassword
            },
                {
                    withCredentials: true
                }
            )

            if (res.data.success) {
                toast.success(res.data.message)
                setOldPassword("");
                setNewPassword("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteAccountHandler = async () => {
        try {
            const res = await axios.delete(`${BACKEND_URL}/api/v1/user/deleteaccount`, {
                withCredentials: true
            })

            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setAuthUser(null))
                navigate('/signup')
            }
        } catch (error) {
            console.log(error)
        }
    }

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
            setActiveTab(name);
        } else if (name === "friends") {
            navigate("/friends");
            setActiveTab(name);
        }
    };

    const logOutHandler = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/api/v1/user/logout`, {
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setSuggestedUsers(null))
                dispatch(setUserSavedPost(null))
                dispatch(setUserFriend(null))
                dispatch(setAllUser(null))
                dispatch(setPosts(null))
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
            console.log(error);
        }
    };

    const clearNotificationHandler = () => {
        dispatch(setNotification({ reaction: "clear" }));
    };

    return (
        <nav className="flex flex-col">
            <div className="bg-white w-screen p-3 -mb-2 flex items-center justify-between sm:justify-between sticky top-0 z-50">
                {/* Left Section: Logo and Search */}
                <div className="flex items-center md:space-x-3 space-x-3 sm:mr-[50px] ">
                    <img src={logo} alt="logo" width={40} onClick={() => { navigate('/') }} className="cursor-pointer" />
                    <div className="relative w-full md:w-full ">
                        <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        <Input type="text"
                            placeholder="Search users..."
                            value={inputSearch}
                            onChange={(e) => setInputSearch(e.target.value)}
                            onFocus={() => setInputTrigger(true)}
                            onBlur={() => setInputTrigger(false)}
                            className="rounded-3xl pl-10 w-full"
                        />
                        {/* Display Search Results */}
                        {inputSearch.trim() && (
                            <div className="absolute bg-white shadow-md mt-2 w-full max-h-60 overflow-y-auto border rounded-md z-60">
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
                <div className="flex md:space-x-[120px] items-center justify-center md:ml-[50px] lg:-ml-[50px] md:pr-[168px]">
                    <button
                        onClick={() => navbarHandler("home")}
                        className="relative flex-col items-center hidden md:flex"
                        title="Home"
                    >
                        <IoHomeOutline className={activeTab === "home" ? "text-blue-500" : "text-gray-500 hidden md:block"} size={22} />
                        {activeTab === "home" && <div className="w-10 h-1 bg-blue-500 rounded-full mt-1"></div>}
                    </button>

                    <button
                        onClick={() => navbarHandler("video")}
                        className="relative flex flex-col items-center"
                        title="Videos"
                    >
                        <Video className={activeTab === "video" ? "text-blue-500" : "text-gray-500 hidden md:block"} size={22} />
                        {activeTab === "video" && <div className="w-10 h-1 bg-blue-500 rounded-full mt-1"></div>}
                    </button>

                    <button
                        onClick={() => navbarHandler("marketplace")}
                        className="relative flex flex-col items-center"
                        title="Marketplace"
                    >
                        <ShoppingBag className={activeTab === "marketplace" ? "text-blue-500" : "text-gray-500 hidden md:block"} size={22} />
                        {activeTab === "marketplace" && <div className="w-10 h-1 bg-blue-500 rounded-full mt-1"></div>}
                    </button>

                    <button
                        onClick={() => navbarHandler("friends")}
                        className="relative flex-col items-center hidden md:block"
                        title="Groups"
                    >
                        <Users className={activeTab === "friends" ? "text-blue-500" : "text-gray-500 hidden md:block"} size={22} />
                        {activeTab === "friends" && <div className="w-10 h-1 bg-blue-500 rounded-full mt-1"></div>}
                    </button>
                </div>

                {/* Right Section: Menu, Notifications, and Avatar */}
                <div className="flex items-center space-x-1">
                    <button onClick={() => navigate("/chat")} className="p-2 rounded-full hover:bg-gray-200 hover:text-blue-500 hidden md:block" title="Menu">
                        <FaFacebookMessenger size={22} />
                    </button>
                    <div className="relative rounded-full p-2 cursor-pointer hover:bg-gray-200 hover:text-blue-500 hidden md:block">
                        <IoNotifications size={24} />
                        {notification?.length > 0 && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 ">
                                        {notification?.length}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent onInteractOutside={clearNotificationHandler}>
                                    <div>
                                        {notification?.length === 0 ? (
                                            <p>No new notification</p>
                                        ) : (
                                            notification &&
                                            notification.map((notification) => {
                                                return (
                                                    <div
                                                        key={notification._id}
                                                        className="flex items-center gap-2 my-2"
                                                    >
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={notification.author?.profilePicture}
                                                            />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <p className="text-sm">
                                                            <span className="font-bold">
                                                                {notification.author?.username}
                                                            </span>{" "}
                                                            {notification.reaction === "like" && (
                                                                <span>react like on your post</span>
                                                            )}
                                                            {notification.reaction === "love" && (
                                                                <span>react love on your post</span>
                                                            )}
                                                            {notification.reaction === "wow" && (
                                                                <span>react wow on your post</span>
                                                            )}
                                                            {notification.reaction === "sad" && (
                                                                <span>react sad on your post</span>
                                                            )}
                                                            {notification.reaction === "angry" && (
                                                                <span>react angry on your post</span>
                                                            )}
                                                            {notification.reaction === "haha" && (
                                                                <span>react haha on your post</span>
                                                            )}
                                                            {notification?.text && (
                                                                <span>comment  on your post</span>
                                                            )}
                                                            {
                                                                notification?.originalPost && (
                                                                    <span>share your post</span>
                                                                )
                                                            }
                                                        </p>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    <div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar onClick={() => setOpenProfile(true)} className="w-8 h-8 cursor-pointer mr-2">
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent onInteractOutside={() => setOpenProfile(false)}>
                                <div className="flex flex-col cursor-pointer">


                                    <div className="flex">
                                        <Avatar className="w-7 h-7">
                                            <AvatarImage src={user?.profilePicture} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <span className="ml-4">{user?.username}</span>
                                    </div>
                                    <hr className="border-b bg-black w-full my-2" />
                                    <span onClick={() => navigate(`profile/${user._id}`)} className="text-blue-500 font-semibold">See all profiles</span>

                                    <div className="flex items-center gap-2 mt-2">
                                        <HelpCircle size={24} color="#422e2e" />
                                        <span>Help & support</span>
                                    </div>

                                    <div onClick={() => setSettingOpen(!settingOpen)} className="flex items-center gap-2 mt-2">
                                        <Settings size={24} color="#422e2e" />
                                        <span>Settings & privacy</span>
                                    </div>

                                    {
                                        settingOpen && (
                                            <div className="flex flex-col mt-2">
                                                <div onClick={deleteAccountHandler} className="flex items-center ">
                                                    <MdDelete size={24} />
                                                    <span className="ml-2">Delete account</span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-lg mt-2">
                                                        Change Password (Optional)
                                                        <input
                                                            type="password"
                                                            placeholder="Old Password"
                                                            className="border rounded-md p-1 h-[30px] text-sm w-full mt-2"
                                                            value={oldPassword}
                                                            onChange={(e) => setOldPassword(e.target.value)}
                                                        />
                                                        <input
                                                            type="password"
                                                            placeholder="New Password"
                                                            className="border rounded-md p-1 h-[30px] text-sm w-full mt-2"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                        />
                                                        <Button className='mt-2' onClick={passwordHandler}>Change Password</Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div onClick={logOutHandler} className="flex items-center gap-2 mt-2">
                                        <LogOut size={24} color="#422e2e" />
                                        <span>Logout</span>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                    </div>
                </div>
            </div>
            <div className="bg-white w-full md:hidden -my-2 shadow-md p-3 flex items-center justify-between sticky top-0 z-10">
                <button
                    onClick={() => navbarHandler("home")}
                    className="relative flex-col items-center"
                    title="Home"
                >
                    <IoHomeOutline className={activeTab === "home" ? "text-blue-500" : "text-gray-500"} size={22} />
                </button>

                <button
                    onClick={() => navbarHandler("video")}
                    className="relative flex flex-col items-center"
                    title="Videos"
                >
                    <Video className={activeTab === "video" ? "text-blue-500" : "text-gray-500"} size={22} />
                    {activeTab === "video" && <div className="w-10 h-1 bg-blue-500 rounded-full mt-1"></div>}
                </button>

                <button
                    onClick={() => navbarHandler("friends")}
                    className="relative flex flex-col items-center"
                    title="Groups"
                >
                    <Users className={activeTab === "friends" ? "text-blue-500" : "text-gray-500"} size={22} />
                </button>

                <button onClick={() => navigate("/chat")} className="p-2 rounded-full hover:bg-gray-200 hover:text-blue-500" title="Menu">
                    <FaFacebookMessenger size={22} />
                </button>
                <div className="relative rounded-full p-2 cursor-pointer hover:bg-gray-200 hover:text-blue-500">
                    <IoNotifications size={24} />
                    {notification?.length > 0 && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 ">
                                    {notification?.length}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent onInteractOutside={clearNotificationHandler}>
                                <div>
                                    {notification?.length === 0 ? (
                                        <p>No new notification</p>
                                    ) : (
                                        notification &&
                                        notification.map((notification) => {
                                            return (
                                                <div
                                                    key={notification._id}
                                                    className="flex items-center gap-2 my-2"
                                                >
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={notification.author?.profilePicture}
                                                        />
                                                        <AvatarFallback>CN</AvatarFallback>
                                                    </Avatar>
                                                    <p className="text-sm">
                                                        <span className="font-bold">
                                                            {notification.author?.username}
                                                        </span>{" "}
                                                        {notification.reaction === "like" && (
                                                            <span>react like on your post</span>
                                                        )}
                                                        {notification.reaction === "love" && (
                                                            <span>react love on your post</span>
                                                        )}
                                                        {notification.reaction === "wow" && (
                                                            <span>react wow on your post</span>
                                                        )}
                                                        {notification.reaction === "sad" && (
                                                            <span>react sad on your post</span>
                                                        )}
                                                        {notification.reaction === "angry" && (
                                                            <span>react angry on your post</span>
                                                        )}
                                                        {notification.reaction === "haha" && (
                                                            <span>react haha on your post</span>
                                                        )}
                                                        {notification?.text && (
                                                            <span>comment  on your post</span>
                                                        )}
                                                        {
                                                            notification?.originalPost && (
                                                                <span>share your post</span>
                                                            )
                                                        }
                                                    </p>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>

            </div>

        </nav>
    );
};

export default Navbar;
