import React from 'react';
import { useLocation } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { TiEdit } from "react-icons/ti";

interface BlogPostProps {
  _id:string
  title: string;
  description: string;
  image: string;
  handleDelete : any
  handleEdit : any
}

const BlogPost: React.FC<BlogPostProps> = ({_id, title, description, image ,handleDelete,handleEdit }) => {

  const location = useLocation();

  return (
    <>
      <div className="mb-6">
        <img src={image} alt={title} className="w-full h-40 object-cover rounded-lg mb-2" />
        <div className='flex justify-between'>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          {location.pathname === '/myBlogs' && (
            <div className="flex space-x-2 mt-2">
              <TiEdit onClick={handleEdit} className="text-gray-500 cursor-pointer" size={20} title="Edit" />
              <MdDelete onClick={()=> handleDelete(_id)} className="text-gray-500 cursor-pointer" size={20} title="Delete" />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600">{description.slice(0,150)}...</p>
      </div>
    </>
  );
}

export default BlogPost;
