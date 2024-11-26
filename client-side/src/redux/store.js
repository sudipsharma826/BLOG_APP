import { configureStore } from '@reduxjs/toolkit';
import userReducer   from './user/authSlice.js';

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default store;