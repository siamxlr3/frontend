import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({ page = 1, per_page = 10, search = '', status = '' }) => 
                `users?page=${page}&per_page=${per_page}&search=${search}&status=${status}`,
            providesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useGetUsersQuery, useDeleteUserMutation } = userApi;
