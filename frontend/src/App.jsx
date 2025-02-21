import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import MainLayout from './components/Mainlayout';
import Home from './components/Home';
import ChatPage from './components/ChatPage';
import UserProfile from './components/UserProfile';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setSocket } from './redux/socketSlice';
import { setMessages, setOnlineUsers } from './redux/chatSlice';
import { setNotification } from './redux/rtnSlice';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../configURL';
import Friends from './components/Friends';
import SuggestedUsers from './components/SuggestedUsers';
import Saved from './components/Saved';
import ProtectedRoutes from './components/ProtectedRoutes';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <ProtectedRoutes><Home /></ProtectedRoutes>
      },
      {
        path: '/friends',
        element: <ProtectedRoutes><Friends /></ProtectedRoutes>
      },
      {
        path: '/suggestedusers',
        element: <ProtectedRoutes><SuggestedUsers /></ProtectedRoutes>
      },
      {
        path: '/savedpost',
        element: <ProtectedRoutes><Saved/></ProtectedRoutes>
      }
    ]
  },
  {
    path: '/chat',
    element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
  },
  {
    path: '/profile/:id',
    element: <ProtectedRoutes><UserProfile /></ProtectedRoutes>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
])

function App() {
  const { user } = useSelector(store => store.auth)
  const { socket } = useSelector(store => store.socketio)
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      const socketio = io(`${BACKEND_URL}`, {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (reaction) => {
        dispatch(setNotification(reaction));
      });
      
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return <RouterProvider router={browserRouter} />;
}

export default App;
