import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiX } from 'react-icons/fi';

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Max 100 characters"),
  description: z.string().optional(),
  status: z.enum(['pending', 'done']).default('pending'),
});

const TaskForm = ({ initialData, onSubmit, onClose, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData || { title: '', description: '', status: 'pending' },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-dark mb-6">
          {initialData ? 'Edit Task' : 'Create Task'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
            <input 
              {...register('title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder="E.g. Restock Vitamin C"
              disabled={isLoading}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              {...register('description')}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary disabled:bg-gray-100"
              placeholder="Verify batch numbers before marking as done."
              disabled={isLoading}
            ></textarea>
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              {...register('status')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary disabled:bg-gray-100 bg-white"
              disabled={isLoading}
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
            {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-4 py-2 text-white bg-primary hover:bg-blue-700 rounded-lg transition disabled:opacity-50 flex items-center"
            >
              {isLoading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
