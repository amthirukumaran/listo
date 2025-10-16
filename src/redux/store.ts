import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authenticationSlice';

const store = configureStore({
    reducer: {
        authSlice
    }
})

export default store

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;