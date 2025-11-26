import { configureStore } from '@reduxjs/toolkit';
import costsReducer from './costsSlice';

export const store = configureStore({
  reducer: {
    costsFilter: costsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
