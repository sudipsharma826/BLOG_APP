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
            state.currentUser = action.payload
            
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.currentUser = null;
        },
        resetError: (state) => {
            state.error = null;
        },
        
    },
});

export const { 
    signInStart, 
    signInSuccess, 
    signInFailure,
   resetError  
} = userSlice.actions;

export default userSlice.reducer;