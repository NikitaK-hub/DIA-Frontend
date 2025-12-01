import { configureStore } from "@reduxjs/toolkit";
import costsReducer from "./costsSlice";
import userReducer from "./userSlice";
import costRequestReducer from "./costRequestSlice";

export const store = configureStore({
  reducer: {
    costsFilter: costsReducer,
    user: userReducer,
    costRequest: costRequestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
