import Navbar from './Navbar';
import Footer from './Footer';
import BlogPost from './BlogPost';
import { useEffect, useState } from 'react';
import { IBlog } from './Home';
import { deleteBlog, getAllBlogsByUser, updateBlog } from '../api/userApi';
import { useSelector } from 'react-redux';
import { rootState } from '../Redux/store';
import Swal from 'sweetalert2';
import EditBlogPostModal from './EditBlog';
import toast from 'react-hot-toast';

const MyBlog = () => {
  const userData = useSelector((prevState: rootState) => prevState.user.userData);

  const [myBlogs, setMyBlogs] = useState<IBlog[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState<IBlog | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!userData) return;
      const response = await getAllBlogsByUser(userData?._id);
      setMyBlogs(response.data);
    };
    fetchBlogs();
  }, [userData]);

  const onClose = () => {
    setEditBlog(null);
    setEditModalOpen(false);
  };

  const handleEditModal = (blog: IBlog) => {
    setEditBlog(blog);
    setEditModalOpen(true);
  };

  const handleEdit = async (formData: IBlog) => {
    try {
      setEditLoading(true);
      if(!editBlog?._id){
        return
      }
      const response = await updateBlog(editBlog?._id,formData.title,formData.description,formData.image)
      if(response.data.status){
        setMyBlogs((prev) => 
          prev.map((item) => {
            if(item._id==editBlog._id){
              console.log(response.data.data)
              return response.data.data
            }else{
              return item
            }
          }
          )
        );
        toast.success('Blog Updated Successfully')
      }
      console.log(myBlogs )
      setEditBlog(null)
      setEditLoading(false);
      return true
    } catch (error) {
      setEditLoading(false);
      console.error("Error editing blog:", error);
      return false
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to delete?',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteBlog(_id);
          if (response.data) {
            setMyBlogs((blog) => blog.filter((post) => post._id !== _id));
          }
        }
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <section className="flex-grow mb-12 px-2 py-2">
          <h2 className="text-2xl font-bold mb-6">My Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myBlogs.length > 0 ? (
              myBlogs.map((post) => (
                <BlogPost
                  key={post._id}
                  handleEdit={() => handleEditModal(post)}
                  handleDelete={handleDelete}
                  {...post}
                />
              ))
            ) : (
              <p>No blogs found.</p>
            )}
          </div>
        </section>
        <Footer />
      </div>
      <EditBlogPostModal
        loading={editLoading}
        isOpen={editModalOpen}
        onClose={onClose}
        onSubmit={handleEdit}
        initialData={editBlog}
      />
    </>
  );
};

export default MyBlog;
