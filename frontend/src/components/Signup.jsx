import React, { useEffect, useState } from "react";
import { Input } from "../components/ui/input"
import { Link, useNavigate } from 'react-router-dom'
import { BACKEND_URL } from "../../configURL";
import { toast } from "sonner";
import { Button } from "./ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: '',
    gender: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const {user} = useSelector(store=>store.auth)

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/register`, input, {
        headers: {
          'Content-type': 'application/json'
        },
        withCredentials: true
      })
      if (res.data.success) {
        navigate("/login")
        toast.success(res.data.message)
        setInput({
          username: "",
          gender: "",
          email: "",
          password: ""
        })
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-blue-600 text-4xl font-bold text-center mb-4">Facebook</h1>
        <h2 className="text-xl font-semibold text-center">Create a new account</h2>
        <p className="text-gray-500 text-center mb-4">It’s quick and easy.</p>
        <form onSubmit={signupHandler} className="space-y-4">
          <div className="ml-2">Username</div>
          <div className="flex gap-2">
            <Input type='text' name='username' value={input.username} onChange={changeEventHandler} placeholder='username' />
          </div>
          <div className="flex justify-between">
            <label className="flex items-center gap-2 mr-1 border rounded-md px-11 py-1 w-1/2">
              <Input type="radio" name="gender" value="female" checked={input.gender == 'female'} onChange={changeEventHandler} className='h-4' /> Female
            </label>
            <label className="flex items-center gap-2 ml-1 border rounded-md px-11 py-1 w-1/2">
              <Input type="radio" name="gender" value="male" checked={input.gender == 'male'} onChange={changeEventHandler} className='h-4' /> Male
            </label>
          </div>

          <Input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="Email" className="w-full p-2 border rounded-md" />
          <Input type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="New password" className="w-full p-2 border rounded-md" />

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By clicking Sign Up, you agree to our <a href="#" className="text-blue-500">Terms</a>, <a href="#" className="text-blue-500">Privacy Policy</a> and <a href="#" className="text-blue-500">Cookies Policy</a>.
          </p>

          {
            loading ? (
              <Button className="relative w-full py-2 rounded-md text-lg font-semibold bg-green-600 hover:bg-green-700">
                <div className="flex items-center justify-center space-x-2 w-full">
                  <Loader2 className="text-white w-5 h-5 animate-spin" />
                  <span className="text-white">Please wait</span>
                </div>
              </Button>
            ) : (
              <Button type="submit" className="w-full py-2 rounded-md text-lg font-semibold bg-green-600 hover:bg-green-700">
                Sign Up
              </Button>
            )
          }



          <div className="text-center text-blue-600 text-sm cursor-pointer"><Link to='/login'>Already have an account?</Link></div>
        </form>
      </div>
    </div>
  );
};

export default Signup;