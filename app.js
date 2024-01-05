const express = require('express');
require('dotenv').config();
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT;
const userRoute = require('./routes/User');
const messagesRoute = require('./routes/Messages');
const db = require('./config/connection');
const cookieParser = require('cookie-parser');


app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/home', (req, res) => {
    res.send('Home Page');
});

app.use('/users', userRoute);
app.use('/messages',messagesRoute)

app.all('/*', (req, res) => {
    res.status(404).send('<h1> 404 Error page not found</h1>');
});



server.listen(PORT, () => {
    console.log(`server running on port`, PORT);
});
const io = require('socket.io')(server, {
    pingTimeout:60000,
    cors: {
        origin: ['http://localhost:3000']
    }
});

io.on('connection', (socket) => {
    console.log(' connected to socket.io id ',socket.id);
    socket.on('setup',(username)=>{
        // console.log(username)
        socket.join(username)
        socket.emit('connected')

    })
    socket.on('send-message',(message,cb)=>{
        console.log(message)
        console.log('hihihih',cb(message))
        
        const room ='cM6lOpTPK_Ki1oeMAAAH'
    // socket.broadcast.emit('recieve-message', message, room)
    // socket.broadcast.emit('recieve-message', message)

        socket.to("QS1QWqj-04wYKaUlAAAP").emit('recieve-message', message)




        
    })
});