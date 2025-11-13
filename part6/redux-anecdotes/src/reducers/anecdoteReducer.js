import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { setNotification } from './notificationReducer'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload.id
      const noteToChange = state.find(n => n.id === id)
      if (noteToChange) {
        noteToChange.votes += 1
      }
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const {setAnecdotes,createAnecdote, vote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const notes = await anecdoteService.getAll()
    dispatch(setAnecdotes(notes))
  }
}

export const addAnecdote = (content) => {
  return async (dispatch) => {
    try {
      const newAn = await anecdoteService.createNew(content)
      dispatch(createAnecdote(newAn))
      dispatch(setNotification(`You added a new anecdote: "${content}"`, 5))
    } catch (error) {
      console.error('Error creating anecdote:', error)
      dispatch(setNotification('Failed to add anecdote. Please try again.', 5))
    }
  }
}
export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.updateVote(anecdote)
    dispatch(vote(updatedAnecdote))
    dispatch(setNotification(`You voted for "${anecdote.content}"`))
  }
}

export default anecdoteSlice.reducer