import React from 'react'
import Navbar from './Navbar.jsx'
import Profile from './Profile.jsx'
import useGetMutualFriends from '@/hooks/useGetMutualFriends.jsx'
import useGetUserProfile from '@/hooks/useGetUserProfile.jsx'
import { useParams } from 'react-router-dom'

const UserProfile = () => {
  const params = useParams();
  const userId = params.id;
  useGetMutualFriends();
  useGetUserProfile(userId);
  return (
    <div className='flex flex-col h-screen overflow-y-auto'>
      <Navbar/>
        <Profile/>
    </div>
  )
}

export default UserProfile