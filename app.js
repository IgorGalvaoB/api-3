require('dotenv').config();
const express = require('express');
const app = express()
const connect = require('./config/db.config');
const cors = require('cors')
const server = require('http').Server(app);
const { Server } = require('socket.io');
const Conversations = require('./models/Conversation.model');
const User = require('./models/User.model');
const Message = require('./models/Message.model');

app.use(cors());

app.use(express.json())

app.use('/auth', require('./routes/auth.routes'))

app.use(require('./middlewares/auth.middleware'))

app.use('/user', require('./routes/user.routes'))

app.use('/image', require('./routes/image.routes'))

app.use('/post/', require('./routes/post.routes'))

app.use('/comment', require('./routes/comment.routes'))

app.use('/messages', require('./routes/chat.routes'))

const io = new Server(server, {
  cors: {
    origin: '*',
    transports: ['websocket'],
    credentials: true,

  }
});
const database = {};

/* io.on('connection', (socket) => {
  //console.log('New user connected');
  socket.on('users', msg => {

    database[msg] = socket.id;
    console.log(database)
  })

  socket.on('is on', (who, user) => {

    if (database[who]) {

      io.to(database[user]).emit('is on', true, who)

    } else {

      io.to(database[user]).emit('is on', false, who)

    }
  })
  socket.on('Private message', ({ msg, from, to }) => {
    io.to(database[to]).emit('Private message', msg,to , from)
   
    io.to(database[from]).emit('Private message', msg, to ,from)
      const handlerDb = async (msg,from,to) => { 
      let conversation_one = await Conversations.findOne({ user: from, conversationWith: to })
      let conversation_two = await Conversations.findOne({ user: to, conversationWith: from })
      const user_one = await User.findOne({ _id: from })
      const user_two = await User.findOne({ _id: to })
      
      if (!conversation_one || !conversation_two) {
        console.log('a')
        conversation_one = await Conversations.create({
          user: user_two._id,
          conversationWith: user_one._id,
        })
        conversation_two = await Conversations.create({
          user: user_one._id,
          conversationWith: user_two._id,
        })
        user_one.conversations.push(conversation_one._id)
        user_two.conversations.push(conversation_two._id)
  
      }else{
        console.log('b')
      }
      const message = await Message.create({

        sender: user_one._id,
        content: msg,
      })
      await conversation_one.messages.push(message._id)
      conversation_one.lastMessage = message._id
      await conversation_one.save()
      await  conversation_two.messages.push(message._id)
      conversation_two.lastMessage = message._id
      await conversation_two.save()
    } 
    handlerDb(msg,from,to) 
   console.log(msg,from,to)
  })
})
 */
server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`)
})