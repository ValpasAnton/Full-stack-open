import {voteAnecdote} from '../reducers/anecdoteReducer'
import {useSelector, useDispatch} from 'react-redux'

const AnecdoteList = () => {

	const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filtered = anecdotes.filter(a =>
      a.content.toLowerCase().includes(filter.toLowerCase())
    )
    return filtered.sort((a, b) => b.votes - a.votes)
  })

  const dispatch = useDispatch()

  const voteHandler = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
  }

	return (
		<div>
 			{anecdotes.map(anecdote => (
      	<div key={anecdote.id}>
        	<div>{anecdote.content}</div>
        	<div>
          	has {anecdote.votes}
          	<button onClick={() => voteHandler(anecdote)}>vote</button>
        	</div>
      	</div>
    	))}
		</div>
	)
}

export default AnecdoteList