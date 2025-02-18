import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BACKEND_URL } from "../../configURL";
import { setMutualFriends } from "@/redux/authSlice";
import { toast } from "sonner";

const useGetMutualFriends = () => {
    const dispatch = useDispatch();
    const { userProfile } = useSelector(store=>store.auth);
    useEffect(() => {
        const fetchMutualFriends = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/v1/user/mutualfriend/${userProfile._id}`, {
                  withCredentials: true
                })
                if (res.data.success) {
                  toast.success(res.data.message);
                  dispatch(setMutualFriends(res.data.mutual))
                }
              } catch (error) {
                console.log(error)
              }
        }
        fetchMutualFriends();
    }, []);
};
export default useGetMutualFriends;
