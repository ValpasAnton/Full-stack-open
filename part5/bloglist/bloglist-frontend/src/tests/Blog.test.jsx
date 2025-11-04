import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Blog from '../components/blog'
import { vi } from 'vitest'

// I need to mock the blogService because of the way my Blog component works
vi.mock('../services/blogs', () => ({
  default: {
    update: vi.fn().mockResolvedValue({}),
  },
}))


describe('<Blog />', () => {

  const blog = {
    title: 'Testing blog',
    author: 'Rami',
    url: 'testurl',
    likes: 5,
    user: { name: 'Alice', id: '123' },
  }

  let container

  const mockOnLike = vi.fn()
  const mockOnDelete = vi.fn()
  const mockNotify = vi.fn()

  beforeEach(() => {
    mockOnLike.mockClear()
    mockOnDelete.mockClear()
    mockNotify.mockClear()

    container = render(
      <Blog
        blog={blog}
        user={blog.user}
        onLike={mockOnLike}
        notify={mockNotify}
        onDelete={mockOnDelete}
      />
    ).container
  })

  test('renders title and author but not URL or likes', () => {


    const summary = container.querySelector('.blog-summary')
    expect(summary).toHaveTextContent('Testing blog')
    expect(summary).toHaveTextContent('Rami')

    const url = container.querySelector('.blog-url')
    const likes = container.querySelector('.blog-likes')

    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
  })

  test('URL and number of likes are shown after the view button is pressed', async () => {

    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const url = container.querySelector('.blog-url')
    const likes = container.querySelector('.blog-likes')

    expect(url).toBeVisible()
    expect(likes).toBeVisible()
    expect(url).toHaveTextContent('testurl')
    expect(likes).toHaveTextContent('likes: 5')
  })
  test('When like button is called twice, the corresponding event handler is called twice', async () => {
    const user = userEvent.setup()

    await user.click(screen.getByText('view'))

    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockOnLike).toHaveBeenCalledTimes(2)
  })
})
