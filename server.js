const express  = require('express')
const path =  require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')
const port = process.env.PORT || 3000;

//Instantiating
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Static path
app.use(express.static(path.join(__dirname,'public')))

//PORT
const PORT = 3000 || process.env.PORT;

//Variables
const botName = 'Chatcord Bot'

//Run when client connect
io.on('connection', socket => {
    console.log(`New WS Connection...${socket.id}`)

    //Join Room msg
    socket.on('joinRoom', ({username, room})=>{

        const user = userJoin(socket.id, username, room);
        socket.join(user.room)
        //Emit chat message
        socket.emit('message', formatMessage(botName,'Welcome to Anuj Chatcord!'))

        //Broadcast when a client connects (to all users except self)
        socket.broadcast
        .to(user.room)
        .emit('message', 
        formatMessage(botName,`${user.username} has joined the chat`)
        );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    })

    //Listen to chat msg
    socket.on('chatMesssage', (msg)=>{
        //Get current user
        const user = getCurrentUser(socket.id);
        //Broadcast to all clients (no exception)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    //Run when a disconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);

        if (user)
        {
        //Broadcast to all clients (no exception)
        io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`))
        }

        //Send Users and Room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        })
    })

})

server.listen(port,'0.0.0.0', ()=>console.log(`server is running on ${PORT}`))