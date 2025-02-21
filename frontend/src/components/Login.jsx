import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../configURL";
import { toast } from 'sonner';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // Add navigate hook
    const {user}= useSelector(store=>store.auth)
    const dispatch= useDispatch()

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });  // Fix typo here
    }

    const signinHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${BACKEND_URL}/api/v1/user/login`, input, {  // Use input instead of Input
                headers: {
                    'Content-type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                navigate("/");  // Redirect on successful login
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });  // Reset input fields
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/")
        }
    },[])

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="flex w-full max-w-4xl items-center justify-between bg-white p-8 shadow-md rounded-lg">
                {/* Left Side: Recent Logins */}
                <div className="hidden md:block w-1/2">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Logins</h2>
                    <p className="text-gray-600 mb-6">Click your picture or add an account.</p>
                    <div className="flex items-center space-x-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md">
                            <img
                                src="https://via.placeholder.com/100"
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                            <Button className="absolute top-1 right-1 bg-gray-800 text-white rounded-full text-xs px-2">✕</Button>
                        </div>
                        <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded-lg cursor-pointer">
                            <span className="text-3xl text-gray-500">+</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2">
                    <form onSubmit={signinHandler} className="space-y-4">
                        <div className='my-4'>
                            <h1 className="text-blue-600 text-4xl font-bold text-center mb-4">Facebook</h1>
                            <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
                        </div>
                        <Input
                            type="email"
                            placeholder="Email or phone number"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                        />
                        {
                            loading ? (
                                <Button className="relative w-full py-3 rounded-md text- font-semibold bg-blue-600 hover:bg-blue-700">
                                    <div className="flex items-center justify-center space-x-2 w-full">
                                        <Loader2 className="text-white w-5 h-5 animate-spin" />
                                        <span className="text-white">Please wait</span>
                                    </div>
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                                >
                                    Log In
                                </Button>
                            )
                        }

                        <span className='flex items-center justify-center'>Doesn't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
