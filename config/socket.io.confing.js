const { server } = require('../app.js')
const { Server } = require('socket.io')

const io = new Server(server,{
    cors:{
        origin: 'http://localhost:3000',
        credentials: true
    }
});

module.exports = io;
