import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

export interface CounterState {
  value: number;
};

const initialState: CounterState = {
  value: 0,
};

const counter = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    incremented: (state: CounterState) => {
      state.value += 1
    },
    decremented: (state: CounterState) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
});

export default counter;
