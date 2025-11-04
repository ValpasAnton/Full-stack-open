import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ content: null, positive: false })


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const handleLogin = async event => {
    console.log('login clicked')
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch  {
      setMessage({ content: 'Wrong username or password' , positive: false })
      setTimeout(() => {
        setMessage({ content: null, positive: false })
      }, 5000) }
  }

  const handleLogout =  event => {
    console.log('logout clicked')
    event.preventDefault()

    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedNoteappUser')
    setUsername('')
    setPassword('')
  }

  const handleCreate = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))

      blogFormRef.current.toggleVisibility()

      setMessage({ content: `a new blog ${createdBlog.title} by ${createdBlog.author} added`, positive: true })
      setTimeout(() => {
        setMessage({ content: null, positive: false })
      }, 5000)
    }
    catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Something went wrong'

      setMessage({ content: errorMessage, positive: false })
      setTimeout(() => {
        setMessage({ content: null, positive: false })
      }, 5000)
    }
  }
  const handleLike = updatedBlog => {
    setBlogs(blogs.map(b => b.id !== updatedBlog.id ? b : updatedBlog))
  }

  const handleDeleteBlog = (deletedBlog) => {
    setBlogs(blogs.filter(blog => blog.id !== deletedBlog.id))
  }

  const showMessage = (content, positive = true) => {
    setMessage({ content: content, positive: positive })
    setTimeout(() => {
      setMessage({ content: null, positive: false })
    }, 5000)
  }


  const sortBlogs = () => {
    const sorted = blogs.sort((a, b) => b.likes - a.likes)
    return (
      sorted
    )
  }


  const loginForm = () => {

    if (!user) {
      return (
        <div>
          <div>
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </div>
        </div>
      )
    }
    return null
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog' hideButtonLabel='cancel' ref={blogFormRef} >
      <BlogForm createBlog={handleCreate} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Bloglist application</h2>
        <Notification message={message}/>
        {loginForm()}
      </div>
    )
  }


  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message}/>
      <div>{user.name} logged in
        <form onSubmit = {handleLogout}>
          <button type="submit">logout</button>
        </form>
      </div>
      {blogForm()}
      <div className="blog-list">
        {sortBlogs().map(blog =>
          <Blog key={blog.id} blog={blog} onLike={handleLike} notify={showMessage} user={user} onDelete={handleDeleteBlog} />
        )}
      </div>
    </div>
  )
}


export default App