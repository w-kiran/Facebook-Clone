import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar.jsx'
import LeftSidebar from './LeftSidebar'
import useGetAllPost from '../hooks/useGetAllPost'
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers'

const Home = () => {

    useGetAllPost();
    useGetSuggestedUsers();
    return (
        <div className='flex justify-between h-screen bg-gray-100'>
            <div className='w-[25%] overflow-y-auto scrollbar-thin'>
                <LeftSidebar/>
            </div>
            
            <div className='flex-grow overflow-auto scrollbar-none'>
                <Feed/>
                <Outlet />
            </div>
            <div className='w-[25%] overflow-y-auto scrollbar-thin'>
                <RightSidebar />
            </div>
            
        </div>
    )
}

export default Home