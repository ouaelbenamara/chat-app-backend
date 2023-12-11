const express =require( 'express')
require('dotenv').config();
const app = express()
const PORT = process.env.PORT;
const userRoute = require('./routes/User')
const db = require('./config/connection');
const cookieParser = require('cookie-parser')
require('./config/authenticationStrategy');
app.use(express.json())
app.use(cookieParser())

app.use('/home',(req,res)=>{
    res.send('Home Page')
})



app.use('/users',userRoute)
app.all('/*',(req,res)=>{
    res.status(404).send('<h1> 404 Error page not found</h1>')
})



app.listen(3000,()=>{
    console.log(`server running on port`,PORT)
})
