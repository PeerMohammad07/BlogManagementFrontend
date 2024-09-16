import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { rootState } from '../Redux/store'
import { userLogout } from '../Redux/userSlice'

const Navbar = () => {

  const dispatch = useDispatch()
  const userData =  useSelector((state:rootState)=> state.user.userData)

  const handleLogout = ()=>{
    dispatch(userLogout())
  }

  return (
    <>
      <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">DesignUX</h1>
            <nav>
              <ul className="flex space-x-4">
                <li><Link to={"/"} className="text-gray-600 hover:text-gray-900">Home</Link></li>
                <li><Link to={"/myBlogs"} className="text-gray-600 hover:text-gray-900">My Blogs</Link></li>
                <li><a className="text-gray-600 hover:text-gray-900">About</a></li>
                <li><a className="text-gray-600 hover:text-gray-900">Service</a></li>
                <li><a className="text-gray-600 hover:text-gray-900">Contact</a></li>
              </ul>
            </nav>
          {userData ? <>
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded">
              Logout
            </button>
          </> :
          <button className="bg-orange-500 text-white px-4 py-2 rounded"><Link to={'/login'}>Log in</Link></button>}
          </div>
        </header>
    </>
  )
}

export default Navbar
