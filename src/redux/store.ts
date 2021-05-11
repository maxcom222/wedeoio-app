import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from './slices/authSlice';
import teamReducer from './slices/teamSlice';
import toastReducer from './slices/toastSlice';
import projectReducer from './slices/projectSlice';
import fileReducer from './slices/fileSlice';
import mediaSlice from './slices/mediaSlice';
import commentSlice from './slices/commentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    team: teamReducer,
    project: projectReducer,
    file: fileReducer,
    player: mediaSlice,
    comment: commentSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
