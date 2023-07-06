import { createSlice, configureStore } from '@reduxjs/toolkit'

export const alertsSlice = createSlice({
  initialState: {
    value: [],
  },
  name: 'alerts',
  reducers: {
    addAlert: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value.push(action.payload)
    },
  },
})

export const { addAlert } = alertsSlice.actions

export const store = configureStore({
  reducer: alertsSlice.reducer,
})
