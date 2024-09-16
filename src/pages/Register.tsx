import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../api/userApi';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';

const Register = () => {
  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)

  const FormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Username must not be less than 3 characters")
      .max(25, "Username must not be greater than 25 characters")
      .regex(
        /^[a-zA-Z0-9_ ]+$/, 
        "The username must contain only letters, numbers, spaces, and underscores (_)"
      )
      .refine((name) => name.trim() !== "", {
        message: "Username cannot be empty",
      }),
    email: z
      .string()
      .trim()
      .email("Invalid email. Email must be a valid email address")
      .refine((email) => {
        const trimmedEmail = email.trim();
        return !/^\d+$/.test(trimmedEmail);
      }, {
        message: "Email must not contain numbers only",
      }), 
    password: z
      .string()
      .trim() 
      .min(6, "Password must not be less than 6 characters")
      .max(16, "Password must not be greater than 16 characters")
      .refine((password) => {
        const trimmedPassword = password.trim();
        return trimmedPassword === trimmedPassword.replace(/\s+/g, '');
      }, {
        message: "Password cannot contain spaces",
      })
      .refine((password) => password.trim() !== "", {
        message: "Password cannot be empty",
      }), 
    confirmPassword: z
      .string()
      .trim() 
      .min(1, "Please confirm your password")
      .refine((password) => password.trim() !== "", {
        message: "Confirm password cannot be empty",
      }), 
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });


  type IFormInput = z.infer<typeof FormSchema>;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      setLoading(true)
      const formData = {name:data.name,email:data.email,password:data.password}
      const response = await registerApi(formData)
      if(response?.data.status){
        setLoading(false)
        navigate("/login")
      }
    } catch (error:any) {
      setLoading(false)
      if(!error.response.data.status){
        const errorMessages = error.response.data.message 
        for (const [field, message] of Object.entries(errorMessages)) {
          setError(field as keyof IFormInput, {
            type: 'manual',
            message : message as any
          });
        }

      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">User Name</label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your full name"
                {...register('name')}
              />
              {errors.name && <p className="text-red-500 text-sm italic">{errors.name.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your email"
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-sm italic">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Create a password"
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-sm italic">{errors.password.message}</p>}
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm italic">{errors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
            >
             {loading ? <><SyncLoader speedMultiplier={1} color='#ffffff' margin={1} size={5}/>
             </>: "Sign Up"}
            </button>
          </form>
        </div>
        <div className="px-6 py-4 bg-orange-100">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
