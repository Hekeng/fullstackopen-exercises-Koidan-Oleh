const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    const body = request.body

    const user = request.user

    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)

    await user.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user

    if (!user) {
      return response.status(400).json({ error: 'userId missing or not valid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blogId missing or not valid' })
    }

    if (blog.user && blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'Only the creator of a blog can delete it.' })
    } else {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
      runValidators: true,
      context: 'query',
    })

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
