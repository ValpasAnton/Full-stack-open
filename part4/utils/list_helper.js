const dummy = (blogs) => {
  return (1)
}

const totalLikes = (blogs) => {
  const arrayOfLikes = (blogs.map(b =>b.likes))
  const total = (arrayOfLikes.reduce((a,b) => a+b, 0))
  return (total)
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const mostLikes = Math.max(...blogs.map(n => n.likes))
  const favorites = blogs.filter(n => n.likes === mostLikes)
  return (favorites[0])
}


const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const blogsGroupedbyAuthor = []

  const arrayWithremovedGroup = (arr) =>{
    const newGroup = arr.filter(b => b.author === arr[0].author)
    blogsGroupedbyAuthor.push(newGroup)   
    const newArray = arr.filter(b => b.author !== arr[0].author)
    console.log(`length of unused part of array after grouping: ${newArray.length}`)
    return (newArray)
  }

  let blogVar = blogs
  while (blogVar.length > 0 ) {
    blogVar = arrayWithremovedGroup(blogVar)
  }

  const authorWithMost = blogsGroupedbyAuthor.reduce((most, arr) => {
    return arr.length > most.length ? arr : most
  }, [])
  
  return ({
    author: authorWithMost[0].author,
    blogs: authorWithMost.length
  })

}

const mostLikes = (blogs) => {
  const likes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

   const authorWithMost = Object.entries(likes).reduce(
    (max, [author, like]) => like > max.likes ? { author, likes: like } : max,
    { author: null, likes: 0 }
  )
  return authorWithMost
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
