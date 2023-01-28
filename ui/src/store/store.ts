import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import counter from './counter'

export const store = configureStore({
  reducer: {
    counter: counter.reducer
  }
})

// store.subscribe(() => console.log(store.getState()))
// store.dispatch(incremented())
// store.dispatch(incremented())
// store.dispatch(decremented())

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
