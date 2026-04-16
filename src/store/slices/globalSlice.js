import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    theme: 'light',
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        }
    }
});

export const { setLoading, toggleTheme } = globalSlice.actions;
export default globalSlice.reducer;
