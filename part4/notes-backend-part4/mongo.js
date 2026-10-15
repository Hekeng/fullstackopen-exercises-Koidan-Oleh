const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://hexen:${password}@cluster0.dpviuvd.mongodb.net/testNoteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note1 = new Note({
  content: 'HTML is easy',
  important: true,
})

const note2 = new Note({
  content: 'Browser can execute only JavaScript',
  important: false,
})

note1.save().then(() => {
  console.log('first note saved!')
  return note2.save()
}).then(() => {
  console.log('second note saved!')
  mongoose.connection.close()
})