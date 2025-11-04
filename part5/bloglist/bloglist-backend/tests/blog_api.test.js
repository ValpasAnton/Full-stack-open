const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const { initialBlogs, testUserCreate } = require('./test_helper')
const bcrypt = require('bcrypt')


const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const userId = await testUserCreate()

  await Blog.deleteMany({})

  const firstBlog = new Blog({...initialBlogs[0], user: userId})
  await firstBlog.save()

  const secondBlog = new Blog({...initialBlogs[1], user: userId})
  await secondBlog.save()
})

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  assert.ok(blogs.length > 0, 'No blogs returned')

  blogs.forEach(blog => {
    assert.ok(blog.id, 'id property is missing')
  })
})

test('a valid blog can be added ', async () => {
  const loginRes = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' })
    .expect(200)
  const token = loginRes.body.token

  const newBlog = {
    title: "newblog",
    author: "newblogger",
    url: "newurl",
    likes: 0,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  assert(titles.includes('newblog'))
})

test('a blog without the like property has 0 likes', async () => {
  const loginRes = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' })
    .expect(200)
  const token = loginRes.body.token

  const newBlog = {
    title: "newblog2",
    author: "newblogger2",
    url: "newurl2", 
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const savedBlogId = response.body.id 
  const savedBlog = await Blog.findById(savedBlogId)

 
  assert.strictEqual(savedBlog.likes, 0)
})

test('a blog gets deleted properly', async () => {
   const loginRes = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' })
    .expect(200)
  const token = loginRes.body.token

  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const ids = blogsAtEnd.map(n => n.id)

  assert(!ids.includes(blogToDelete.id))
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    title: blogToUpdate.title + ' (updated)',
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 5
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.title, updatedData.title)
  assert.strictEqual(response.body.likes, updatedData.likes)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.title, updatedData.title)
  assert.strictEqual(updatedBlog.likes, updatedData.likes)
})

test.only('a user with a password or username with less than 3 characters cannot be created, nor one which does not a a unique username', async () => {
  const userWithShortPassword = {
    "username": "Naynay",
    "name": "nibber",
    "password": "st"
  }

  await api
    .post('/api/users')
    .send(userWithShortPassword)
    .expect(400)

  const userWithShortUN = {
    "username": "Na",
    "name": "nibb",
    "password": "stuka"
  }

  await api
    .post('/api/users')
    .send(userWithShortUN)
    .expect(400)

  const sameUsername = {
    "username": "Nanana",
    "name": "nikc",
    "password": "mummo"
  }

  await api
    .post('/api/users')
    .send(sameUsername)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  await api
    .post('/api/users')
    .send(sameUsername)
    .expect(400)
})




after(async () => {
  await mongoose.connection.close()
})