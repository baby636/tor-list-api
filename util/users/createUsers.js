const mongoose = require('mongoose')

const config = require('../../config')

const EMAIL = 'test2@test.com'
const PASSWORD = 'test'

async function addUser () {
  // Connect to the Mongo Database.
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true) // Stop deprecation warning.
  await mongoose.connect(
    config.database,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  const User = require('../../src/models/users')

  const userData = {
    email: EMAIL,
    password: PASSWORD
  }

  const user = new User(userData)

  // Enforce default value of 'user'
  user.type = 'admin'

  await user.save()

  await mongoose.connection.close()

  console.log(`User ${EMAIL} created.`)
}
addUser()

module.exports = {
  addUser
}
