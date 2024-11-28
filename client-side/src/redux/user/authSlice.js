import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.currentUser = action.payload;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.currentUser = null;
        },
        signUpStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signUpSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        signUpFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.currentUser = null;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        }
    },
});

export const { 
    signInStart, 
    signInSuccess, 
    signInFailure, 
    signUpFailure, 
    signUpStart, 
    signUpSuccess,
    signOut
} = userSlice.actions;

export default userSlice.reducer;