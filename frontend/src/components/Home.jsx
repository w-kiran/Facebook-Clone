import React, { useState } from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar.jsx'
import LeftSidebar from './LeftSidebar'
import useGetAllPost from '../hooks/useGetAllPost'
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers'
import { Button } from './ui/button'
import { MoreVertical } from 'lucide-react'

const Home = () => {

    const [hiddenLeft,setHiddenLeft]=useState(false)
    const [hiddenRight,setHiddenRight]=useState(false)
    useGetAllPost();
    useGetSuggestedUsers();
    return (
        <div className="relative flex h-screen bg-gray-100">
            {/* Left Sidebar - Overlay when toggled */}
            <div
                className={`fixed top-0 left-0 h-full w-full md:w-[25%] overflow-y-auto scrollbar-thin shadow-lg transition-transform duration-300 z-20 ${
                    hiddenLeft ? "translate-x-0" : "-translate-x-full"
                } md:static md:translate-x-0`}
            >
                <LeftSidebar />
            </div>

            {/* Left Sidebar Toggle Button */}
            <Button
                className="absolute w-2 top-0 z-50 md:hidden"
                onClick={() => setHiddenLeft(!hiddenLeft)}
            >
                <MoreVertical />
            </Button>

            {/* Main Content */}
            <div className="flex-grow overflow-auto scrollbar-none relative z-10">
                <Feed />
                <Outlet />
            </div>

            {/* Right Sidebar - Overlay when toggled */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[25%] bg-gray-100 overflow-y-auto scrollbar-thin shadow-lg transition-transform duration-300 z-20 ${
                    hiddenRight ? "translate-x-0" : "translate-x-full"
                } md:static md:translate-x-0`}
            >
                <RightSidebar />
            </div>

            {/* Right Sidebar Toggle Button */}
            <Button
                className="absolute w-2 top-0 right-0 z-50 md:hidden"
                onClick={() => setHiddenRight(!hiddenRight)}
            >
                <MoreVertical />
            </Button>
        </div>
    )
}

export default Home