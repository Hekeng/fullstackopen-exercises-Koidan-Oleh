const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { newBlog } = require('./test_helper')

const api = supertest(app)

let token = null

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'testuser', passwordHash })
    const savedUser = await user.save()

    const userForToken = {
      username: savedUser.username,
      id: savedUser.id,
    }
    token = jwt.sign(userForToken, config.SECRET)

    const blogObjects = helper.initialBlogs.map((blog) => {
      blog.user = savedUser.id
      return new Blog(blog)
    })

    for (let blog of blogObjects) {
      await blog.save()
    }
  })

  test('blogs are returned as json and in the correct amount', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(Object.keys(response.body[0]).includes('id'), true)
  })

  describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogsAtStartLeng = blogsAtStart.length

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const hasTitle = blogsAtEnd.map((b) => b.title).includes(newBlog.title)
      let blogsAtEndLeng = blogsAtEnd.length

      assert.strictEqual(blogsAtEndLeng, blogsAtStartLeng + 1)
      assert.strictEqual(hasTitle, true)
    })

    test('fails with status code 401 if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogsAtStartLeng = blogsAtStart.length

      const response = await api.post('/api/blogs').send(newBlog).expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      let blogsAtEndLeng = blogsAtEnd.length

      assert.strictEqual(blogsAtEndLeng, blogsAtStartLeng)
      assert.strictEqual(response.body.error, 'token invalid')
    })

    test('if likes property is missing, it defaults to 0', async () => {
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.blogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status code 400 if title or url is missing', async () => {
      const newBlogWithError = helper.blogWhithError

      await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlogWithError).expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogsAtStartLeng = blogsAtStart.length
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const blogsAtEndLeng = blogsAtEnd.length
      const titles = blogsAtEnd.map((b) => b.title)

      assert.strictEqual(blogsAtEndLeng, blogsAtStartLeng - 1)
      assert.strictEqual(titles.includes(blogToDelete.title), false)
    })
  })

  describe('updating a blog', () => {
    test('succeeds in updating likes with status code 200', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlogData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
      }

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlogInDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id)
      let updatedLikes = updatedBlogInDb.likes

      assert.strictEqual(updatedLikes, blogToUpdate.likes + 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})

// const { test, after, beforeEach, describe } = require('node:test')
// const assert = require('node:assert')
// const mongoose = require('mongoose')
// const supertest = require('supertest')
// const app = require('../app')
// const helper = require('./test_helper')
// const Blog = require('../models/blog')
// const { newBlog } = require('./test_helper')

// const api = supertest(app)

// describe('when there is initially some blogs saved', () => {
//   beforeEach(async () => {
//     await Blog.deleteMany({})
//     await Blog.insertMany(helper.initialBlogs)
//   })

//   test('blogs are returned as json and in the correct amount', async () => {
//     const response = await api
//       .get('/api/blogs')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)

//     assert.strictEqual(response.body.length, helper.initialBlogs.length)
//   })

//   test('unique identifier property is named id', async () => {
//     const response = await api.get('/api/blogs')

//     assert.strictEqual(Object.keys(response.body[0]).includes('id'), true)
//   })

//   describe('addition of a new blog', () => {
//     test('a valid blog can be added', async () => {
//       const blogsAtStart = await helper.blogsInDb()

//       const blogsAtStartLeng = blogsAtStart.length

//       await api
//         .post('/api/blogs')
//         .send(newBlog)
//         .expect(201)
//         .expect('Content-Type', /application\/json/)

//       const blogsAtEnd = await helper.blogsInDb()

//       const hasTitle = blogsAtEnd.map((b) => b.title).includes(newBlog.title)

//       let blogsAtEndLeng = blogsAtEnd.length

//       assert.strictEqual(blogsAtEndLeng, blogsAtStartLeng + 1)
//       assert.strictEqual(hasTitle, true)
//     })

//     test('if likes property is missing, it defaults to 0', async () => {
//       const response = await api
//         .post('/api/blogs')
//         .send(helper.blogWithoutLikes)
//         .expect(201)
//         .expect('Content-Type', /application\/json/)

//       assert.strictEqual(response.body.likes, 0)
//     })

//     test('fails with status code 400 if title or url is missing', async () => {
//       const newBlog = helper.blogWhithError

//       await api.post('/api/blogs').send(newBlog).expect(400)

//       const blogsAtEnd = await helper.blogsInDb()
//       assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
//     })
//   })
//   describe('deletion of a blog', () => {
//     test('succeeds with status code 204 if id is valid', async () => {
//       const blogsAtStart = await helper.blogsInDb()

//       const blogsAtStartLeng = blogsAtStart.length

//       const blogToDelete = blogsAtStart[0]

//       await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

//       const blogsAtEnd = await helper.blogsInDb()

//       const blogsAtEndLeng = blogsAtEnd.length
//       const titles = blogsAtEnd.map((b) => b.title)

//       assert.strictEqual(blogsAtEndLeng, blogsAtStartLeng - 1)
//       assert.strictEqual(titles.includes(blogToDelete.title), false)
//     })
//   })

//   describe('updating a blog', () => {
//     test('succeeds in updating likes with status code 200', async () => {
//       const blogsAtStart = await helper.blogsInDb()

//       const blogToUpdate = blogsAtStart[0]

//       const updatedBlogData = {
//         title: blogToUpdate.title,
//         author: blogToUpdate.author,
//         url: blogToUpdate.url,
//         likes: blogToUpdate.likes + 1,
//       }

//       const response = await api
//         .put(`/api/blogs/${blogToUpdate.id}`)
//         .send(updatedBlogData)
//         .expect(200)
//         .expect('Content-Type', /application\/json/)

//       const blogsAtEnd = await helper.blogsInDb()

//       const updatedBlogInDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id)

//       let updatedLikes = updatedBlogInDb.likes

//       assert.strictEqual(updatedLikes, blogToUpdate.likes + 1)
//     })
//   })
// })

// after(async () => {
//   await mongoose.connection.close()
// })
