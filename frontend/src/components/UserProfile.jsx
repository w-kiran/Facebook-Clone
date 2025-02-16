import React from 'react'
import Navbar from './Navbar.jsx'
import Profile from './Profile.jsx'

const UserProfile = () => {
  return (
    <div className='flex flex-col h-screen overflow-y-auto'>
      <Navbar/>
        <Profile/>
    </div>
  )
}

export default UserProfile