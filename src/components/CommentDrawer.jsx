import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiX, FiSend, FiTrash2 } from 'react-icons/fi';
import { useGetCommentsByTaskQuery, useCreateCommentMutation, useDeleteCommentMutation } from '../store/api/commentApi';
import { toast } from 'react-toastify';

const commentSchema = z.object({
  message: z.string().min(1, "Comment cannot be empty").max(500, "Comment too long"),
});

const CommentDrawer = ({ task, onClose }) => {
  const { data: response, isLoading } = useGetCommentsByTaskQuery({ task_id: task.id, params: { per_page: 50 } });
  const [createComment, { isLoading: isPosting }] = useCreateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(commentSchema)
  });

  const onSubmit = async (data) => {
    try {
      await createComment({ task_id: task.id, message: data.message }).unwrap();
      reset(); // clear input
    } catch (err) {
        toast.error("Failed to post comment");
    }
  };

  const handleDelete = async (commentId) => {
    if(window.confirm('Delete this comment permanently?')) {
        try {
            await deleteComment(commentId).unwrap();
        } catch(err) {
            toast.error("Failed to delete comment");
        }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-50 h-full w-full max-w-md shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <div>
            <h2 className="text-lg font-bold text-dark">Discussion</h2>
            <p className="text-xs text-gray-500 font-medium">Task: {task.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Comment List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
                <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : response?.data?.length === 0 ? (
                <div className="text-center text-gray-400 py-10 mt-10">
                    <p className="font-medium">No comments yet.</p>
                    <p className="text-sm">Be the first to start the discussion!</p>
                </div>
            ) : (
                response?.data?.map(comment => (
                    <div key={comment.id} className={`flex flex-col ${comment.is_mine ? 'items-end' : 'items-start'}`}>
                        <div className="text-xs text-gray-500 mb-1 px-1">
                            {comment.is_mine ? 'You' : comment.author_name} • {new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div className={`group relative max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm 
                            ${comment.is_mine ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                            {comment.message}
                            
                            {comment.is_mine && (
                                <button 
                                    onClick={() => handleDelete(comment.id)}
                                    className="absolute top-1/2 -translate-y-1/2 -left-8 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                                >
                                    <FiTrash2 size={14}/>
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Floating Input Box */}
        <div className="bg-white p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
                <div className="flex-1">
                    <input 
                        {...register('message')}
                        placeholder="Type a message..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition"
                        disabled={isPosting}
                        autoComplete="off"
                    />
                    {errors.message && <span className="absolute text-[10px] text-red-500 ml-4 mt-1">{errors.message.message}</span>}
                </div>
                <button 
                    type="submit" 
                    disabled={isPosting}
                    className="p-3 bg-primary text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 shrink-0 shadow-md"
                >
                    <FiSend size={16} />
                </button>
            </form>
        </div>
        
      </div>
    </div>
  );
};

export default CommentDrawer;
