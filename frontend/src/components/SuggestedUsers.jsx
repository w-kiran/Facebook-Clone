import axios from "axios";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../configURL";
import LeftSideBar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";


const SuggestedUsers = () => {
  const [friends, setFriends] = useState([]);
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
    <div className='flex h-screen overflow-hidden'>
      <div className='w-[25%]'>
        <LeftSideBar />
      </div>

      <div className='flex-grow overflow-auto border-x scrollbar-none'>
        <div className="w-full flex flex-col mx-auto">
          <div className=" text-2xl border-b p-5 ">Suggested Friends</div>
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
      <div className='w-[25%] overflow-y-auto'>
        <RightSidebar />
      </div>

    </div>

  );
};

export default SuggestedUsers;