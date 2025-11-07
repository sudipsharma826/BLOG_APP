import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer   from './user/authSlice.js';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';
import themeReducer from './theme/themeSlice.js';


//Combing reducers
const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer
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