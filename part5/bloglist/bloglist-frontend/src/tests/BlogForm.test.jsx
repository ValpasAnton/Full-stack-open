import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import BlogForm from '../components/BlogForm'

describe('<NewBlogForm />', () => {
  test('calls event handler that was passed down as a prop with correct details when a new blog is created', async () => {
    const user = userEvent.setup()
    const mockCreateBlog = vi.fn()

    render(<BlogForm createBlog={mockCreateBlog} />)

    await user.type(screen.getByRole('textbox', { name: /title/i }), 'My Test Blog')
    await user.type(screen.getByRole('textbox', { name: /author/i }), 'Rami')
    await user.type(screen.getByRole('textbox', { name: /url/i }), 'http://test.com')

    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'My Test Blog',
      author: 'Rami',
      url: 'http://test.com'
    })
  })
})