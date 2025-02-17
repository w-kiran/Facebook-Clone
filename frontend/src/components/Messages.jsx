import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';
import { setSelectedMessages, deleteMessage } from '@/redux/chatSlice'; // Assuming deleteMessage action exists
import axios from 'axios';
import { BACKEND_URL } from '../../configURL';
import { toast } from 'sonner';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    const { messages, selectedMessage } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [openPopout, setOpenPopout] = useState(false); // State for popout visibility

    // Handle delete message
    const handleDeleteMessage = async (msgId) => {
        try {
            const res = await axios.delete(`${BACKEND_URL}/api/v1/message/delete/${msgId}`, { withCredentials: true })
            if (res.data.success) {
                dispatch(deleteMessage(msgId)); // Call delete action or API
                setOpenPopout(false);
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const closePopout = () => {
        setOpenPopout(false);
    };

    return (
        <div className='flex-1 flex flex-col overflow-y-auto p-4 bg-gray-50'>

            <div className='flex flex-col gap-3 overflow-y-auto px-4 py-2 h-full'>
                <div className='flex justify-center mb-4'>
                    <div className='flex flex-col items-center'>
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className='font-semibold mt-2'>{selectedUser?.username}</span>
                        <Link to={`/profile/${selectedUser?._id}`}>
                            <Button className="h-8 mt-2" variant="secondary">View Profile</Button>
                        </Link>
                    </div>
                </div>

                {messages
                    .filter(msg =>
                        (msg.senderId === user?._id && msg.receiverId === selectedUser?._id) ||
                        (msg.senderId === selectedUser?._id && msg.receiverId === user?._id)
                    )
                    .map((msg) => (
                        <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                            {!msg.isDeleted ? (
                                <div
                                    onClick={() => {
                                        dispatch(setSelectedMessages(msg));
                                        setOpenPopout(true);
                                    }}
                                    className={`p-3 rounded-xl max-w-xs break-words shadow-md ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    <div>{msg.message}</div>
                                </div>
                            ) : (
                                <div className='p-3 rounded-xl max-w-xs break-words shadow-md bg-red-300 text-red-500 border-red-600 font-semibold'>
                                    Message deleted
                                </div>
                            )}
                        </div>
                    ))}

            </div>


            {/* Popout Modal */}
            {openPopout && selectedMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
                        <p>{selectedMessage.message}</p>
                        <div className="mt-4 flex justify-between">
                            <button
                                onClick={() => handleDeleteMessage(selectedMessage._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={closePopout}
                                className="bg-gray-300 text-black px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Messages;
