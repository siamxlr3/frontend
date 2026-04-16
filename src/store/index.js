import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import globalReducer from './slices/globalSlice';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
    reducer: {
        global: globalReducer,
        auth: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});
