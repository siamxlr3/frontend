import React, { useState, useEffect } from 'react';
import { 
    useGetTasksQuery, 
    useDeleteTaskMutation, 
    useCreateTaskMutation, 
    useUpdateTaskMutation 
} from '../store/api/taskApi';
import TasksTable from '../components/TasksTable';
import TaskForm from '../components/TaskForm';
import CommentDrawer from '../components/CommentDrawer';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

const Tasks = () => {
    // URL State management
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Comments State
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [activeCommentTask, setActiveCommentTask] = useState(null);

    // RTK Queries
    const { data: response, isLoading, isFetching } = useGetTasksQuery({ 
        page, 
        per_page: perPage, 
        search: debouncedSearch,
        status: statusFilter
    });
    
    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    // Debounce search input to prevent rapid API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // reset pagination when searching
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id) => {
        if(window.confirm('Are you certain you want to delete this task?')) {
            try {
                await deleteTask(id).unwrap();
                toast.success('Task permanently deleted');
            } catch (err) {
                toast.error('Failed to delete task');
            }
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingTask) {
                await updateTask({ id: editingTask.id, ...data }).unwrap();
                toast.success('Task updated successfully');
            } else {
                await createTask(data).unwrap();
                toast.success('New task created');
            }
            closeForm();
        } catch (err) {
            toast.error(err.data?.message || 'Failed to save task');
        }
    };

    const openCreateForm = () => {
        setEditingTask(null);
        setIsFormOpen(true);
    };

    const openEditForm = (task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    const openComments = (task) => {
        setActiveCommentTask(task);
        setIsCommentsOpen(true);
    };

    const closeComments = () => {
        setIsCommentsOpen(false);
        setActiveCommentTask(null);
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
            <ToastContainer position="top-right" />
            
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-dark to-primary">
                        Task Management
                    </h1>
                    <p className="text-gray-500 mt-1">Organize and track your daily operations.</p>
                </div>
                
                <button 
                    onClick={openCreateForm}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                    <FiPlus size={20} /> New Task
                </button>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                {/* Advanced Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full max-w-md">
                        <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition"
                        />
                        {isFetching && <div className="absolute right-3 top-3 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <select 
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="px-4 py-2.5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="done">Done</option>
                        </select>
                        <select 
                            value={perPage}
                            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
                            className="px-4 py-2.5 border rounded-lg bg-gray-50 hover:bg-gray-100 transition focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value={5}>5 per page</option>
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                        </select>
                    </div>
                </div>

                <TasksTable 
                    data={response?.data} 
                    isLoading={isLoading} 
                    onDelete={handleDelete}
                    onEdit={openEditForm}
                    onOpenComments={openComments}
                />

                {/* RTK Managed Pagination */}
                {response?.meta && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500 font-medium">
                            Showing {response.data?.length || 0} of {response.meta.total || 0} tasks
                        </span>
                        <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 text-sm font-medium rounded-md disabled:opacity-40 hover:bg-white hover:shadow-sm transition"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-sm font-bold text-primary bg-white shadow-sm rounded-md">
                                {page}
                            </span>
                            <button 
                                disabled={!response.data || response.data.length < response.meta.per_page}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 text-sm font-medium rounded-md disabled:opacity-40 hover:bg-white hover:shadow-sm transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Overlay Component */}
            {isFormOpen && (
                <TaskForm 
                    initialData={editingTask} 
                    onSubmit={handleFormSubmit} 
                    onClose={closeForm}
                    isLoading={isCreating || isUpdating}
                />
            )}

            {/* Comments Drawer Component */}
            {isCommentsOpen && activeCommentTask && (
                <CommentDrawer 
                    task={activeCommentTask} 
                    onClose={closeComments} 
                />
            )}
        </div>
    );
};

export default Tasks;
