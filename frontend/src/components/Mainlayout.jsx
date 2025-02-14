import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

const MainLayout = () => {
  return (
    <div className='flex flex-col h-screen overflow-y-auto'>
      <Navbar/>
      <div className="flex-grow h-screen overflow-hidden">
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout