const mongoose = require('mongoose')

const connect = async () => {
  const connection = await mongoose.connect(process.env.MONGO_DB_URL)
  console.log(`Database connected: ${connection.connections[0].name} `)
}

module.exports = connect();