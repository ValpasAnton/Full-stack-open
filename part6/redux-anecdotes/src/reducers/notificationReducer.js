import { createSlice } from '@reduxjs/toolkit'

const initialState = 'Welcome to the Anecdotes app!' 

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

const { showNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, seconds) => {
  return dispatch => {
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer