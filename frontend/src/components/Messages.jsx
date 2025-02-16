import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='flex h-full'>
            {/* Sidebar */}
            <div className='w-1/3 border-r p-4 bg-gray-100'>
                <h2 className='text-lg font-semibold mb-4'>Chats</h2>
                <div className='flex items-center gap-2 p-2 bg-white rounded-md shadow-sm'>
                    <Avatar className='h-10 w-10'>
                        <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <span className='font-semibold'>{selectedUser?.username}</span>
                        <p className='text-sm text-gray-500'>Active now</p>
                    </div>
                </div>
            </div>
            
            {/* Chat section */}
            <div className='flex-1 flex flex-col justify-between'>
                {/* Header */}
                <div className='p-4 border-b flex items-center justify-between bg-white'>
                    <div className='flex items-center gap-3'>
                        <Avatar className='h-10 w-10'>
                            <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className='font-semibold'>{selectedUser?.username}</span>
                            <p className='text-sm text-gray-500'>Last seen 2h ago</p>
                        </div>
                    </div>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button className='h-8' variant='secondary'>View profile</Button>
                    </Link>
                </div>

                {/* Messages */}
                <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
                    {messages && messages.map((msg) => (
                        <div key={msg._id} className={`flex my-2 ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 max-w-xs rounded-lg shadow ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className='p-4 border-t bg-white flex items-center gap-2'>
                    <input type='text' placeholder='Aa' className='flex-1 p-2 border rounded-full focus:outline-none' />
                    <Button className='bg-blue-500 text-white px-4 py-2 rounded-full'>Send</Button>
                </div>
            </div>
        </div>
    );
};

export default Messages;
