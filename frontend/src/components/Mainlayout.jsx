import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar/>
      <div className="flex-grow">
        <Outlet/>
      </div>
    </div>
  )
}

export default MainLayout