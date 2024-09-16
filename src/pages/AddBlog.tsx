import React, { useState } from 'react';
import Modal from 'react-modal';
import { X, Upload } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SyncLoader } from 'react-spinners';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

Modal.setAppElement("#root")

const schema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  description: z.string().trim().min(20, { message: "Description must be at least 20 characters" }).max(5000, { message: "Description must not exceed 5000 characters" }),
  image: z.any()
    .refine((file) => file instanceof File, "Image is required")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png, .webp, and .gif formats are supported"
    )
});

type FormData = z.infer<typeof schema>;

interface BlogPostModalProps {
  loading : boolean
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: FormData) => void;
}

const BlogPostModal: React.FC<BlogPostModalProps> = ({loading, isOpen, onClose, onSubmit }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      image: undefined
    }
  });

  const onSubmitForm = (data: FormData) => {
    onSubmit(data);
    reset();
    setPreviewImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue('image', file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-2xl w-full mx-auto my-8 bg-white p-8 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      style={{
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
        },
        overlay: {
          zIndex: 1000,
        },
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Create a Blog Post</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-150">
          <X size={28} />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="title"
                placeholder='Enter your title'
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            )}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                id="description"
                placeholder='Enter your description'
                rows={2} // Reduced from 4 to 2
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                style={{ minHeight: '50px' }} // Reduce height
              />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Add Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="text-center">
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="mx-auto h-40 w-56 object-cover rounded-md" /> // Set max width and height
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 "
                >
                  <span className='ps-5'>Upload a file</span>
                  <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange, onBlur, value, ...props } }) => (
                      <input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        onChange={(e) => {
                          handleImageChange(e);
                          onChange(e.target.files ? e.target.files[0] : null);
                        }}
                        onBlur={onBlur}
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        {...props}
                      />
                    )}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          </div>
          {errors.image && !previewImage && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
          >
           {loading ? <><SyncLoader speedMultiplier={1} color='#ffffff' margin={1} size={5}/>
           </>: "Create a Post"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BlogPostModal;
