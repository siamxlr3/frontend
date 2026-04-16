import { baseApi } from './baseApi';
import { supabaseClient } from '../../config/supabase';

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByTask: builder.query({
      query: ({ task_id, params }) => ({
        url: `/comments/task/${task_id}`,
        params, // passes page, per_page 
      }),
      providesTags: (result, error, { task_id }) => [{ type: 'Comment', id: `TASK_${task_id}` }],
      async onCacheEntryAdded(arg, { dispatch, cacheDataLoaded, cacheEntryRemoved }) {
        if (!supabaseClient) return; 
        const { task_id } = arg;
        let channel = null;

        try {
          await cacheDataLoaded;

          channel = supabaseClient
            .channel(`public:comments:task_id=${task_id}`)
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'comments',
                filter: `task_id=eq.${task_id}` 
            }, (payload) => {
              console.log("🔄 Realtime Comment Caught, refreshing data!");
              dispatch(commentApi.util.invalidateTags([{ type: 'Comment', id: `TASK_${task_id}` }]));
            })
            .subscribe((status) => {
               if (status === 'SUBSCRIBED') console.log('✅ Comments WebSocket Connected');
            });

        } catch (error) {
           console.error("Realtime subscription error:", error);
        }

        await cacheEntryRemoved;
        if (channel) supabaseClient.removeChannel(channel);
      },
    }),
    createComment: builder.mutation({
      query: ({ task_id, message }) => ({
        url: `/comments/task/${task_id}`,
        method: 'POST',
        body: { message },
      }),
      invalidatesTags: (result, error, { task_id }) => [{ type: 'Comment', id: `TASK_${task_id}` }],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const {
  useGetCommentsByTaskQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
