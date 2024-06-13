const express= require('express');
const cors =require('cors');
const connectDB =require('./config/db')
const router =require('./router/index.js')
const cookieParser = require('cookie-parser')
require('dotenv').config();

const app= express();
app.use(cors({
    origin:process.env.FRONTEND_DOMAIN,
    credentials:true
}));
// convert res data into json 
// app.use(express.json())

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser())

const PORT = process.env.PORT || 8080;



app.get('/',(req,res)=>{
    res.send("hello")
})
// app.post('/api',(req,res)=>{
//     res.send("hello")
// })

app.use("/api",router)

connectDB().then(()=>{

    app.listen(PORT,()=>{

        console.log('connected to db');
        console.log("Server is Running at PORT ",PORT);
    })
})
