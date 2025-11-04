const { test, expect, beforeEach, describe } = require('@playwright/test')

const newUser = {
  name: 'Matti Luukkainen',
  username: 'mluukkai',
  password: 'salainen'
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', { data: newUser })
    await page.goto('/')
  })
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Username' }).fill('mluukkai')
      await page.getByRole('textbox', { name: 'Password' }).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'Username' }).fill('mluukkai')
      await page.getByRole('textbox', { name: 'Password' }).fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox', { name: 'Username' }).fill('mluukkai')
      await page.getByRole('textbox', { name: 'Password' }).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })
  

    test('a new blog can be created', async ({ page }) => {
  
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByRole('textbox', { name: 'title' }).fill('A random ahh blog')
      await page.getByRole('textbox', { name: 'author' }).fill('Bloggerman')
      await page.getByRole('textbox', { name: 'url' }).fill('https://blogpage')

      await page.getByRole('button', { name: 'create' }).click()

      const blogList = page.locator('.blog-list')
      await expect(blogList.getByText('A random ahh blog')).toBeVisible()
    })
    test('a blog can be liked', async ({ page }) => {
     await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByRole('textbox', { name: 'title' }).fill('A random ahh blog')
      await page.getByRole('textbox', { name: 'author' }).fill('Bloggerman')
      await page.getByRole('textbox', { name: 'url' }).fill('https://blogpage')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      // Setting up 
      const likeButton = page.getByRole('button', { name: 'like' })
      const likeCount = page.locator('.blog-likes') // adjust selector to match your app (e.g., .likeCount or text locator)
      const initialLikesText = await likeCount.textContent()
      const initialLikes = parseInt(initialLikesText.match(/\d+/)?.[0] || '0', 10)

      await likeButton.click()

      await expect(likeCount).toContainText(String(initialLikes + 1))
    })
    test('user who created a blog can delete it', async ({ page }) => {
 
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByRole('textbox', { name: 'title' }).fill('Blog to delete')
      await page.getByRole('textbox', { name: 'author' }).fill('Badauthor')
      await page.getByRole('textbox', { name: 'url' }).fill('delete.me')
      await page.getByRole('button', { name: 'create' }).click()

      var blogList = page.locator('.blog-list')
      await expect(blogList.getByText('Blog to delete')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`)
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'delete' }).click()

      blogList = page.locator('.blog-list')
      await expect(blogList.getByText('Blog to delete')).not.toBeVisible()
    })
  })


  // New test branch
  test('only the user who created a blog sees the delete button', async ({ page, request }) => {

    const user1 = {
      name: 'First user',
      username: 'user1',
      password: 'password123',
    }
    const user2 = {
      name: 'Second user',
      username: 'user2',
      password: 'password456',
    }

    await request.post('/api/users', { data: user1 })
    await request.post('/api/users', { data: user2 })

    await page.goto('/')
    await page.getByRole('textbox', { name: 'Username' }).fill(user1.username)
    await page.getByRole('textbox', { name: 'Password' }).fill(user1.password)
    await page.getByRole('button', { name: 'login' }).click()

    // Posting with user1
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByRole('textbox', { name: 'title' }).fill('Protected Blog')
    await page.getByRole('textbox', { name: 'author' }).fill('author1')
    await page.getByRole('textbox', { name: 'url' }).fill('exampleurl')
    await page.getByRole('button', { name: 'create' }).click()

    var blogList = page.locator('.blog-list')
    await expect(blogList.getByText('Protected Blog')).toBeVisible()

    await page.getByRole('button', { name: 'view' }).click()
    await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
    
    await page.getByRole('button', { name: 'logout' }).click()
    
    // Logging with user2
    await page.getByRole('textbox', { name: 'Username' }).fill(user2.username)
    await page.getByRole('textbox', { name: 'Password' }).fill(user2.password)
    await page.getByRole('button', { name: 'login' }).click()

    await page.getByRole('button', { name: 'view' }).click()

    // ensuring that the delete button doesn't work
    await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(0)
  })

  test('blogs are ordered by number of likes (most likes first)', async ({ page, request }) => {

    await request.post('/api/users', { data: newUser })


    await page.getByRole('textbox', { name: 'Username' }).fill(newUser.username)
    await page.getByRole('textbox', { name: 'Password' }).fill(newUser.password)
    await page.getByRole('button', { name: 'login' }).click()

    const blogs = [
      { title: 'Blog A', author: 'Alice', url: 'a.com' },
      { title: 'Blog B', author: 'Bob', url: 'b.com' },
      { title: 'Blog C', author: 'Charlie', url: 'c.com' }
    ]

    for (const blog of blogs) {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox', { name: 'title' }).fill(blog.title)
      await page.getByRole('textbox', { name: 'author' }).fill(blog.author)
      await page.getByRole('textbox', { name: 'url' }).fill(blog.url)
      await page.getByRole('button', { name: 'create' }).click()
    }

    const likeBlog = async (title, times) => {
      const blog = page.locator('.blog', { hasText: title })
      await blog.getByRole('button', { name: 'view' }).click()

      const likeButton = blog.getByRole('button', { name: 'like' })
      for (let i = 0; i < times; i++) {
        await likeButton.click()
        await page.waitForTimeout(200)
      }
    }

    await likeBlog('Blog A', 2) // 2 likes
    await likeBlog('Blog B', 5) // 5 likes
    await likeBlog('Blog C', 1) // 1 like

    await page.waitForTimeout(500)

    const blogElements = await page.locator('.blog').allTextContents()

    console.log('Blog order:', blogElements)

    expect(blogElements[0]).toContain('Blog B')
    expect(blogElements[1]).toContain('Blog A')
    expect(blogElements[2]).toContain('Blog C')
  })
})