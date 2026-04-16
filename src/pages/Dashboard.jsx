import React from 'react';
import { useGetUsersQuery } from '../store/api/userApi';

const Dashboard = () => {
    const { data: response, error, isLoading, isFetching } = useGetUsersQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-pulse text-lg font-semibold text-primary">Loading Data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                ❌ Error: {error?.data?.message || 'Failed to load user statistics.'}
            </div>
        );
    }

    const cachedNotice = isFetching ? "Updating in background..." : "Up to date!";

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-dark to-primary">
                    Platform Users
                </h1>
                <span className="text-xs text-gray-400 font-mono tracking-wider">{cachedNotice}</span>
            </header>
            
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {response?.data?.map(user => (
                    <div 
                        key={user.id} 
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 group"
                    >
                        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-primary transition-colors">
                            {user.name}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Dashboard;
