const express = require('express');
const cors = require('cors');

const app = express()

var corsOption = {
    origin: "http://localhost:3000"
}

app.use(cors(corsOption))

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.json({message:"Welcome to  my application"})
})

const PORT = 3000;

app.listen(PORT,()=>{
    console.log('server is running on port',PORT);
})
