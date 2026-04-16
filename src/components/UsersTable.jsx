import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const UsersTable = ({ data, isLoading, onDelete }) => {
    if (isLoading) {
        return (
            <div className="w-full p-10 flex justify-center">
                <div className="animate-pulse space-y-4 w-full">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data?.length) {
        return <div className="text-center p-10 text-gray-500">No users found.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left bg-white border border-gray-100 rounded-lg shadow-sm">
                <thead className="bg-gray-50 text-gray-600">
                    <tr>
                        <th className="px-6 py-4 font-medium text-sm">Name</th>
                        <th className="px-6 py-4 font-medium text-sm">Email</th>
                        <th className="px-6 py-4 font-medium text-sm">Status</th>
                        <th className="px-6 py-4 font-medium text-sm text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {user.status ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-center space-x-4 flex justify-center">

                                <button 
                                    onClick={() => onDelete(user.id)} 
                                    className="text-red-500 hover:text-red-700 transition" 
                                    title="Delete"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
