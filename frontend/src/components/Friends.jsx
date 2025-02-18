import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetMyFriends from "@/hooks/usegetMyFriends";
import LeftSideBar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";


const Friends = () => {
  const navigate = useNavigate();
  useGetMyFriends()
  const { userFriend } = useSelector(store => store.auth)

  return (
    <div className='flex h-screen overflow-hidden'>
      <div className='w-[25%]'>
        <LeftSideBar />
      </div>
      <div className='flex-grow overflow-auto border-x scrollbar-none'>
        <div className="w-full flex flex-col mx-auto">
          <div className=" text-2xl border-b p-5 ">Friends</div>
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
      <div className='w-[25%] overflow-y-auto'>
        <RightSidebar />
      </div>

    </div>

  );
};

export default Friends;