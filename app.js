require('dotenv').config();
const express = require ( 'express' );
const app = express()
const server = require( 'http' ).Server( app );
const connect = require('./config/db.config');
const cors = require('cors')

app.use(
    cors({
      credentials: true,
      origin: ['http://localhost:3000']
    })
);

app.use(express.json())

app.use('/auth', require('./routes/auth.routes'))

app.use(require('./middlewares/auth.middleware'))

app.use('/user', require('./routes/user.routes'))

app.use('/image', require('./routes/image.routes'))

app.use('/post/', require('./routes/post.routes'))

app.use('/comment', require('./routes/comment.routes'))


server.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`)
})

module.exports = server;