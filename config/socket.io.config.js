/* const express = require('express');
const app = express();
const { Server } = require('socket.io');
const server = require('../app.js');
require('dotenv').config();

const database = {};

const io = new Server(server,{
  cors:{
      origin: 'http://localhost:3000',
      transports: ['websocket'],
      credentials: true,
      
  }
});
io.on('connection', (socket) => {
  console.log('New user connected');
  socket.on('users',msg=>{
      database[msg] = socket.id;
      console.log(msg)
      console.log(database)
      console.log('aaaaaa')
     
  })
  socket.on('is on',msg=>{
      console.log(msg)
  })

})
module.exports = io; */

