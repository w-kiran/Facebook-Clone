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
        <div className='flex h-screen overflow-hidden'>
            <LeftSidebar/>
            <div className='flex-grow overflow-auto scrollbar-none'>
                <Feed/>
                <Outlet />
            </div>
            <RightSidebar />
        </div>
    )
}

export default Home