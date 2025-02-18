import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_URL } from "../../configURL";
import { setUserFriend } from "@/redux/authSlice";

const useGetMyFriends = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!user || fetched) return; 


    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/friends`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setUserFriend(res.data.friends));
          setFetched(true);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [user, dispatch, fetched]); 

  return null; 
};

export default useGetMyFriends;