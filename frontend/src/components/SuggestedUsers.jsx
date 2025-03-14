import axios from "axios";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../configURL";
import LeftSideBar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";


const SuggestedUsers = () => {
  const [friends, setFriends] = useState([]);
  const [hiddenLeft, setHiddenLeft] = useState(false)
  const [hiddenRight, setHiddenRight] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/suggested`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setFriends(res.data.users);
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, []);


  return (
    <div className='flex h-screen overflow-hidden bg-gray-100'>
      {/* Left Sidebar - Overlay when toggled */}
      <div
        className={`fixed top-50 left-0 h-full w-full md:w-[25%] overflow-y-auto scrollbar-thin shadow-lg transition-transform duration-300 z-50 ${hiddenLeft ? "translate-x-0" : "-translate-x-full"
          } md:static md:translate-x-0`}
      >
        <LeftSideBar />
      </div>

      {/* Left Sidebar Toggle Button */}
      <Button
        className="absolute w-2 top-50 z-50 md:hidden"
        onClick={() => {setHiddenRight(false),setHiddenLeft(!hiddenLeft)}}
      >
        <MoreVertical />
      </Button>

      <div className='flex-grow overflow-auto border-x scrollbar-none'>
        <div className="w-full flex flex-col mx-auto">
          <div className=" text-2xl border-b p-5 md:pl-5 pl-[60px] ">Suggested Friends</div>
          <hr />
          {friends.length === 0 ? (
            <p className="text-gray-500">No suggested friends available.</p>
          ) : (
            friends.map((user) => (
              <div
                className="hover:bg-gray-100 cursor-pointer flex items-center p-4"
                key={user._id}
                onClick={() => navigate(`/profile/${user._id}`)}
              >
                <div className="ml-6">
                  <Avatar className="w-16 h-16 " >
                    <AvatarImage className="w-full h-full object-cover" src={user.profilePicture} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="font-medium mr-6">{user?.bio}</span>
                <span className="font-medium mr-6">{user.username}</span>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Right Sidebar - Overlay when toggled */}
      <div
        className={`fixed top-50 right-0 h-full w-full md:w-[25%] bg-gray-100 overflow-y-auto scrollbar-thin shadow-lg transition-transform duration-300 z-50 ${hiddenRight ? "translate-x-0" : "translate-x-full"
          } md:static md:translate-x-0`}
      >
        <RightSidebar />
      </div>

      {/* Right Sidebar Toggle Button */}
      <Button
        className="absolute w-2 top-50 right-0 z-50 md:hidden"
        onClick={() => {setHiddenLeft(false),setHiddenRight(!hiddenRight)}}
      >
        <MoreVertical />
      </Button>

    </div>

  );
};

export default SuggestedUsers;
