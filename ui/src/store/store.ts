import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import counter from './counter';
import sheet from './sheet';
import user from './user';

export const store = configureStore({
  reducer: {
    counter: counter.reducer,
    sheet: sheet.reducer,
    user: user.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
