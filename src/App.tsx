import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectLogin from './Routes/PrivateRoutes';
import MyBlog from './pages/MyBlog';

const App = () => {

  const router = createBrowserRouter([
    {
      path:"/",
      element : <Home/>
    },{
      path:"/login",
      element : (
        <ProtectLogin>
          <Login />
        </ProtectLogin>
      ),
    },
    {
      path:"/register",
      element:(
        <ProtectLogin>
          <Register />
        </ProtectLogin>
      ),
    },{
      path:"/myBlogs",
      element : <MyBlog/>
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;