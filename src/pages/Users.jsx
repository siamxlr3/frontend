import React, { useState, useEffect } from 'react';
import { useGetUsersQuery, useDeleteUserMutation } from '../store/api/userApi';
import UsersTable from '../components/UsersTable';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useLogoutMutation } from '../store/api/authApi';
import { FiLogOut, FiSearch } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';

const Users = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    const { data: response, isLoading, isFetching } = useGetUsersQuery({ 
        page, 
        per_page: 10, 
        search: debouncedSearch 
    });
    
    const [deleteUser] = useDeleteUserMutation();
    const [logoutApi] = useLogoutMutation();
    const dispatch = useDispatch();

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id).unwrap();
                toast.success('User deleted');
            } catch (err) {
                toast.error('Failed to delete user');
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (e) {
            console.error(e);
        } finally {
            dispatch(logout());
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen">
            <ToastContainer position="top-right" />
            
            <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="flex items-baseline gap-4">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-dark to-primary">
                        User Management
                    </h1>
                    {isFetching && <span className="text-xs text-gray-400 font-mono">Syncing...</span>}
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                >
                    <FiLogOut /> Logout
                </button>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-full max-w-sm">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary bg-gray-50 focus:bg-white transition"
                        />
                    </div>
                </div>

                <UsersTable 
                    data={response?.data} 
                    isLoading={isLoading} 
                    onDelete={handleDelete} 
                />

                {/* Simple Pagination */}
                {response?.meta && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                            Total: {response.meta.total || 0} Records
                        </span>
                        <div className="flex gap-2">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                                Prev
                            </button>
                            <span className="px-4 py-2 font-medium text-dark">{page}</span>
                            <button 
                                disabled={!response.data || response.data.length < response.meta.per_page}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
