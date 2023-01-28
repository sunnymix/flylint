import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store';

export interface CounterState {value: number}

const counterState0: CounterState = {value: 0}

const counter = createSlice({
  name: 'counter',
  initialState: counterState0,
  reducers: {
    incremented: (state: CounterState) => {
      state.value += 1
    },
    decremented: (state: CounterState) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    }
  }
});

export default counter
