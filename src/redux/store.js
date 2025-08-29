// src/app/store.js

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import materialReducer from './materilslice';
import { persistReducer, persistStore } from 'redux-persist';
// 👇 sessionStorage के लिए import
import storageSession from 'redux-persist/lib/storage/session'; 


const persistConfig = {
  key: 'root',
  storage: storageSession, // <-- यह localStorage के बजाय sessionStorage उपयोग करता है
};

const rootReducer = combineReducers({
  auth: authReducer,
  material:materialReducer


});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist की warnings से बचने के लिए
    }),
});

export const persistor = persistStore(store);
