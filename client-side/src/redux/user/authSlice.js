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
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
          },
          deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
          },
          deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
          signoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
          },
        
    },
});

export const { 
    signInStart, 
    signInSuccess, 
    signInFailure,
   resetError ,
   deleteUserStart,
   deleteUserSuccess,
   deleteUserFailure,
   signoutSuccess
} = userSlice.actions;

export default userSlice.reducer;