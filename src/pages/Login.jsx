import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation } from '../store/api/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const [loginApi, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await loginApi(data).unwrap();
      if (result.success && result.data?.session?.access_token) {
         dispatch(setCredentials({ 
            user: result.data.user, 
            token: result.data.session.access_token 
         }));
         toast.success('Login Successful');
         navigate('/users');
      }
    } catch (err) {
      toast.error(err.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <ToastContainer position="top-right" />
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-dark mb-8">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              {...register('email')}
              type="email" 
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-primary focus:border-primary"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              {...register('password')}
              type="password" 
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-primary focus:border-primary"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full px-4 py-2 text-white transition-colors bg-primary rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
