require('dotenv').config();
const express = require ( 'express' );
const connect = require('./config/db.config');
const cors = require('cors')

const app = express()
app.use(
    cors({
      credentials: true,
      origin: ['https://www.google.com']
    })
);

app.use(express.json())

app.use('/auth', require('./routes/auth.routes'))

app.use(require('./middlewares/auth.middleware'))

app.use('/user', require('./routes/user.routes'))

app.use('/image', require('./routes/image.routes'))

app.use('/post/', require('./routes/post.routes'))

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`)
})
