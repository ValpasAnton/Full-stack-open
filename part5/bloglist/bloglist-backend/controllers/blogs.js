const express = require('express')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')


blogRouter.use(express.json())

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', userExtractor, async (request, response) => {

  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({...request.body, user: user.id,})

  if (!blog.likes) {
  blog.likes = 0;
}

  const savedBlog = await blog.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

  user.blogs = user.blogs.concat(blog.id)
  await user.save()

  response.status(201).json(populatedBlog)
})


blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const decodedUser = request.user
  if (!decodedUser) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (decodedUser.id !== blog.user.toString()) {
      return response.status(401).json({ error: 'blog not yours' })
    }

    await blog.deleteOne()
  
    const user = await User.findById(decodedUser.id)
    user.blogs = user.blogs.filter(b => b.toString() !== blog.id)
    await user.save()

    response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  const blogToChange = await Blog.findById(request.params.id)

  try {
    if (!blogToChange) {
      return response.status(404).json({ error: 'blog not found' })
    }
    blogToChange.title = title
    blogToChange.author = author
    blogToChange.url = url
    blogToChange.likes = likes

    const savedBlog = await blogToChange.save()
    const updatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error) }
})


module.exports = blogRouter