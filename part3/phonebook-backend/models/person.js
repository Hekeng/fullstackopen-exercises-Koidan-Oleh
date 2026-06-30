require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)

mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },

  number: {
    type: String,
    validate: {
      validator: function (phoneNumber) {
        if (!phoneNumber) return false
        phoneNumber = phoneNumber.trim()

        if (phoneNumber.length < 8) {
          return false
        }
        const regex = /^\d{2,3}-\d+$/
        return regex.test(phoneNumber)
      },
    },
    required: true,
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
// const Person = mongoose.model("Person", personSchema);

module.exports = mongoose.model('Person', personSchema)
