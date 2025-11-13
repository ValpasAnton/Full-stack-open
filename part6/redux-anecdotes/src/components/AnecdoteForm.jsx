import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addNew = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(addAnecdote(content))
	}

  return (
		<div>
			<h2>create new</h2>
    	<form onSubmit={addNew}>
      	<input name="anecdote" />
      	<button type="submit">add</button>
    	</form>
		</div>
  )
}

export default AnecdoteForm