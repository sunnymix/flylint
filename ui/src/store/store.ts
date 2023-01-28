import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import counter from './counter';
import sheetSlice from '@/components/sheet/sheetSlice';
import user from './user';

export const store = configureStore({
  reducer: {
    counter: counter.reducer,
    sheet: sheetSlice.reducer,
    user: user.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
