import React from 'react';
import { FiEdit, FiTrash2, FiClock, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';

const TasksTable = ({ data, isLoading, onDelete, onEdit, onOpenComments }) => {
    if (isLoading) {
        return (
            <div className="w-full flex justify-center py-10">
                <div className="animate-pulse space-y-4 w-full">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data?.length) {
        return (
            <div className="flex flex-col items-center justify-center p-16 text-gray-400">
                <FiCheckCircle size={48} className="mb-4 text-gray-300" />
                <p className="text-lg">No tasks found. You're all caught up!</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Task</th>
                        <th className="px-6 py-4 font-medium">Author</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Created</th>
                        <th className="px-6 py-4 font-medium text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {data.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="font-medium text-dark">{task.title}</div>
                                {task.description && (
                                    <div className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                {task.is_mine ? 
                                    <span className="font-semibold text-primary">You</span> : 
                                    <span className="font-medium">{task.author_name}</span>
                                }
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                                    ${task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {task.status === 'done' ? <FiCheckCircle size={12}/> : <FiClock size={12}/>}
                                    {task.status === 'done' ? 'Done' : 'Pending'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                {new Date(task.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => onOpenComments(task)}
                                        className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition"
                                        title="View Comments"
                                    >
                                        <FiMessageSquare size={18} />
                                    </button>
                                    {task.is_mine && (
                                        <>
                                            <button 
                                                onClick={() => onEdit(task)}
                                                className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition"
                                                title="Edit Task"
                                            >
                                                <FiEdit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(task.id)} 
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" 
                                                title="Delete Task"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TasksTable;
