import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LeftSideBar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import useGetMyFriends from "@/hooks/useGetMyFriends";
import { useState } from "react";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";


const Friends = () => {
  const [hiddenLeft, setHiddenLeft] = useState(false)
  const [hiddenRight, setHiddenRight] = useState(false)
  const navigate = useNavigate();
  useGetMyFriends()
  const { userFriend } = useSelector(store => store.auth)

  return (
    <div className='flex h-screen overflow-hidden bg-gray-100'>
      {/* Left Sidebar - Overlay when toggled */}
      <div
        className={`fixed top-50 left-0 h-full w-full md:w-[25%] bg-white overflow-y-auto scrollbar-thin shadow-lg transition-transform duration-300 z-50 ${hiddenLeft ? "translate-x-0" : "-translate-x-full"
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
      <div className='flex-grow overflow-auto items-center justify-center border-x scrollbar-none'>
        <div className="w-full flex flex-col mx-auto">
          <div className=" text-2xl border-b p-5 pl-[60px] md:pl-5">Friends</div>
          <hr />
          {userFriend?.length === 0 ? (
            <p className="text-gray-500">You donot have any freind </p>
          ) : (
            userFriend && userFriend.map((user) => (
              <div
                className="hover:bg-gray-100 cursor-pointer flex items-center gap-4 p-4"
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
        className={`fixed top-50 right-0 h-full w-full md:w-[25%] bg-white overflow-y-auto scrollbar-thin shadow-lg transition-transform duration-300 z-50 ${hiddenRight ? "translate-x-0" : "translate-x-full"
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

export default Friends;
