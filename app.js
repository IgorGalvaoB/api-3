require('dotenv').config();
const express = require ( 'express' );
const connect = require('./config/db.config');



const app = express()

app.use(express.json())

app.use('/auth', require('./routes/auth.routes'))

app.use('/user', require('./routes/user.routes'))

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`)
})