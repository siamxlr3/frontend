import { baseApi } from './baseApi';
import { supabaseClient } from '../../config/supabase';

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (params) => ({
        url: '/tasks',
        params, // passes page, per_page, search, status natively
      }),
      providesTags: ['Task'],
      async onCacheEntryAdded(arg, { dispatch, cacheDataLoaded, cacheEntryRemoved }) {
        if (!supabaseClient) return; 
        let channel = null;
        try {
          await cacheDataLoaded;

          channel = supabaseClient
            .channel('public:tasks')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
              console.log("🔄 Realtime Task Event Caught:", payload.eventType);
              dispatch(taskApi.util.invalidateTags(['Task']));
            })
            .subscribe((status) => {
               if (status === 'SUBSCRIBED') console.log('✅ Tasks WebSocket Connected');
            });

        } catch (error) {
           console.error("Realtime subscription error:", error);
        }

        // Clean up socket listener when RTK cache expires/unmounts
        await cacheEntryRemoved;
        if (channel) supabaseClient.removeChannel(channel);
      },
    }),
    getTask: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      // Optimistic Updates could go here, or simple invalidation globally
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
