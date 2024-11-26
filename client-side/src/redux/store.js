import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer   from './user/authSlice.js';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';


//Combing reducers
const rootReducer = combineReducers({
    user: userReducer,
});

// COnfiguration the  Presisted  Setting
const presistConfig = {
    key: 'root',
    storage,
    version: 1, 
}

// Config Of Presisted In React
const persistedReducer = persistReducer(presistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);