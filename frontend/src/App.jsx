import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import MainLayout from './components/Mainlayout';
import Home from './components/Home';
import ChatPage from './components/ChatPage';
import UserProfile from './components/UserProfile';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  },
  {
    path: '/chat',
    element: <ChatPage />
  },
  {
    path: '/profile/:id',
    element: <UserProfile />
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
  return <RouterProvider router={browserRouter} />;
}

export default App;
