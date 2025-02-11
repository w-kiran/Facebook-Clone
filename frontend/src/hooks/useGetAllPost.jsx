import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BACKEND_URL } from "../../configURL";


const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/api/v1/post/getallposts`, { withCredentials: true });
                if (res.data.success) { 
                    console.log(res.data.post);
                    dispatch(setPosts(res.data.post));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    }, []);
};
export default useGetAllPost;