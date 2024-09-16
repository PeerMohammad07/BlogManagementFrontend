import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../api/userApi';
import { userLogin } from '../Redux/userSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email. Email must be a valid email address")
    .refine((email) => !/^\d+$/.test(email), {
      message: "Email must not contain numbers only",
    }), 
  password: z.string().trim().min(3, 'Password must be at least 3 characters long').refine((password) => password.trim() !== "", {
    message: "Password cannot be empty",
  }),
});

type LoginFormInput = z.infer<typeof loginSchema>;

const Login = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    try {
      setLoading(true)
      const formData = { email: data.email, password: data.password }
      const response = await loginApi(formData)
      if (response?.data.status) {
        setLoading(false)
        dispatch(userLogin(response.data.data))
        navigate("/")
      }
    } catch (error: any) {
      setLoading(false)
      if (!error.response.data.status) {
        const errorMessages = error.response.data.message
        for (const [field, message] of Object.entries(errorMessages)) {
          setError(field as keyof LoginFormInput, {
            type: 'manual',
            message: message as any
          });
        }

      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your password"
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-sm italic">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
            >
              {loading ? <><SyncLoader speedMultiplier={1} color='#ffffff' margin={1} size={5} />
              </> : "Sign In"}
            </button>
          </form>
        </div>
        <div className="px-6 py-4 bg-orange-100">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-500 hover:text-orange-600 font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
