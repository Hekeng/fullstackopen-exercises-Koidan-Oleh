const blog = require('../models/blog')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const total = blogs.reduce((accum, value) => {
    return accum + value.likes
  }, 0)

  //   blogs.forEach((e) => {})

  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let result = blogs[0]

  for (let i = 0; i < blogs.length; i++) {
    if (result.likes <= blogs[i].likes) {
      result = blogs[i]
    }
  }

  return result
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authors = []

  for (let i = 0; i < blogs.length; i++) {
    let author_index = authors.findIndex((u) => u.author === blogs[i].author)

    if (author_index >= 0) {
      authors[author_index].blogs += 1
    } else
      authors.push({
        author: blogs[i].author,
        blogs: 1,
      })
  }

  let grosValue = 0
  let result = {}

  for (let j = 0; j < authors.length; j++) {
    if (authors[j].blogs >= grosValue) {
      grosValue = authors[j].blogs

      result = {
        author: authors[j].author,
        blogs: authors[j].blogs,
      }
    } else {
      continue
    }
  }

  return result
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authors = []

  for (let i = 0; i < blogs.length; i++) {
    let author_index = authors.findIndex((u) => u.author === blogs[i].author)

    if (author_index >= 0) {
      authors[author_index].likes += blogs[i].likes
    } else {
      authors.push({
        author: blogs[i].author,
        likes: blogs[i].likes,
      })
    }
  }

  let grosValue = 0
  let result = {}

  for (let j = 0; j < authors.length; j++) {
    if (authors[j].likes >= grosValue) {
      grosValue = authors[j].likes

      result = {
        author: authors[j].author,
        likes: authors[j].likes,
      }
    } else {
      continue
    }
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
