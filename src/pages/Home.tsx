import Footer from './Footer'
import BlogPost from './BlogPost'
import Navbar from './Navbar'
import BlogPostModal from './AddBlog'
import { useEffect, useState } from 'react'
import { createBlog, getAllBlogs } from '../api/userApi'
import { useSelector } from 'react-redux'
import { rootState } from '../Redux/store'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

export interface IBlog {
  _id: string
  title: string
  description: string
  image: string
  userId: string
}

const Home = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [blogPosts, setBlogPosts] = useState<IBlog[] | []>([])
  const userData = useSelector((prevState: rootState) => prevState.user.userData)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await getAllBlogs()
      console.log(response)
      setBlogPosts(response.data)
    }
    fetchBlogs()
  }, [])


  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreatePost = async (postData: any) => {
    try {
      setLoading(true)
      if (!userData) {
        return
      }
      const response = await createBlog(postData.title, postData.image, postData.description, userData._id)
      if (response.data.status) {
        setBlogPosts((prevBlogs) => [response.data.data, ...prevBlogs])
        toast.success("Your blog created")
      }
      setLoading(false)
      closeModal();
    } catch (error) {
      console.log(error)
      setLoading(false)
      closeModal()
    }
  }


  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <section className="bg-gray-900 text-white p-12 rounded-lg mb-8">
            <h2 className="text-4xl font-bold mb-4">Welcome to Our Blog</h2>
            <p className="mb-6">Stay up to date with the latest news and trends in UX design, web development, and digital marketing.</p>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold" onClick={() => {
              if (!userData) {
                Swal.fire({
                  icon: 'warning',
                  title: 'Please log in to create a blog',
                  showCancelButton: false,
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Go to Login',
                }).then((result) => {
                  if (result.isConfirmed) {
                    navigate('/login');
                  }
                });
              } else {
                openModal()
              }
            }}>Create a Blog</button>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <BlogPost handleEdit={null} key={index} handleDelete={null} {...post} />
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
      <BlogPostModal
        isOpen={isModalOpen}
        loading={loading}
        onClose={closeModal}
        onSubmit={handleCreatePost}
      />
    </>
  )
}

export default Home
