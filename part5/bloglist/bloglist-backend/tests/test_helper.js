const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const testUserCreate = async ()  => {
  const passwordHash = await bcrypt.hash('password123', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  return user.id
}

const initialBlogs = [
  {
    title: "Bestblog",
    author: "bestblogger",
    url: "besturl",
    likes: 21,
  },
  {
    title: "Badblog",
    author: "badblogger",
    url: "assurl",
    likes: 0,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, testUserCreate
}