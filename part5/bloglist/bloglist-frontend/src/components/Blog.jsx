import Togglable from './Togglable'
import blogService from '../services/blogs'
import { useState } from 'react'

const Blog = ({ blog, onLike, notify, user, onDelete }) => {

  const [likes, setLikes] = useState(blog.likes)

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: likes + 1
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setLikes(returnedBlog.likes)

    if (onLike) onLike(returnedBlog)
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(blog)
        notify( 'Blog deleted successfully', true )
        onDelete(blog)

      } catch (error) {
        const errorMessage =
          'Something went wrong'
        notify(errorMessage, false )
        console.log(error.response?.data?.error ||
          error.message)
      }
    }
  }


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={blogStyle} className='blog'>
      <div className='blog-summary'>
        {blog.title} {blog.author}
      </div>
      <Togglable buttonLabel='view' hideButtonLabel='hide'>
        <div className='blog-url'>{blog.url}</div>
        <div className='blog-likes'>
          likes: {likes}{' '}
          <button onClick={handleLike}>like</button>
        </div>
        <div className='blog-user'>{blog.user.name}</div>
        {user && blog.user && user.id === blog.user.id && (
          <button onClick={handleDelete}>delete</button>
        )}
      </Togglable>
    </div>
  )}

export default Blog