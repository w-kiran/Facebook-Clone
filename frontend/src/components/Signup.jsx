import React, { useState } from "react";
import Input from "../components/ui/input"
import {Link} from 'react-router-dom'

const Signup = () => {
    const [inputInfo,setInputInfo] = useState({
        username:'',
        gender:'',
        email:'',
        password:''
    })

    const changeHandler = () =>{
        setInputInfo()
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-blue-600 text-4xl font-bold text-center mb-4">facebook</h1>
        <h2 className="text-xl font-semibold text-center">Create a new account</h2>
        <p className="text-gray-500 text-center mb-4">It’s quick and easy.</p>
        <form className="space-y-4">
          <div className="ml-2">Username</div>
          <div className="flex gap-2">
          <Input name='username' value = {inputInfo.username}  onChange={changeHandler} placeholder='username'/>
          </div>

          <div className="flex justify-between">
            <label className="flex items-center gap-2 border rounded-md p-2 w-1/3">
              <Input type="radio" name="gender" /> Female
            </label>
            <label className="flex items-center gap-2 border rounded-md p-2 w-1/3">
              <Input type="radio" name="gender" /> Male
            </label>
            <label className="flex items-center gap-2 border rounded-md p-2 w-1/3">
              <Input type="radio" name="gender" /> Custom
            </label>
          </div>

          {/* Email & Password */}
          <Input type="email" placeholder="Mobile number or email" className="w-full p-2 border rounded-md" />
          <Input type="password" placeholder="New password" className="w-full p-2 border rounded-md" />

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By clicking Sign Up, you agree to our <a href="#" className="text-blue-500">Terms</a>, <a href="#" className="text-blue-500">Privacy Policy</a> and <a href="#" className="text-blue-500">Cookies Policy</a>.
          </p>

          
          <button className="bg-green-600 text-white w-full py-2 rounded-md text-lg font-semibold">Sign Up</button>

      
          <div className="text-center text-blue-600 text-sm cursor-pointer"><Link to='/login'>Already have an account?</Link></div>
        </form>
      </div>
    </div>
  );
};

export default Signup;