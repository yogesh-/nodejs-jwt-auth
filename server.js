require('dotenv').config()
const express = require('express');
const cors = require('cors');
const db = require("./app/config/db.config");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkIfUserExists = require('./app/middleware/checkIfUserExists.js');
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

const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log('server is running on port',PORT);
})

db.connect(err=>{
    if(err){
        console.log('error creating connection to db')
    }else{
        console.log('connted to mysqlDB')
    }
})

// create user

app.post("/api/signup",checkIfUserExists, async(req,res)=>{
    let userName = req.query.user_name
    let userEmail = req.query.user_email
    let userPassword = bcrypt.hashSync(req.query.user_pass,10)
    try {
        db.query('INSERT INTO users(userName,userEmail,userPassword) VALUES (?,?,?)',[userName,userEmail,userPassword],(err,result)=>{
            if(err){
                res.status(404).send({message:'Could not create the user, try again'})
            }else{
                res.status(200).send(result)
            }
        })
    } catch (error) {
        console.log(error)
    }
})

// login user

app.post("/api/signin",(req,res)=>{
    const user_pass = req.query.user_pass
    console.log(req.query.user_name,req.query.user_pass)
    try {
        db.query(`SELECT * FROM users WHERE userName = '${req.query.user_name}'`,(err,result)=>{
            if(err){
                res.status(404).send({message:'Something went wrong'})
            }else{
                const hashedPass = result[0].userPassword
                const passwordMatches = bcrypt.compareSync(user_pass, hashedPass);
                if (passwordMatches) {
                    // if password matches then send a jwt token
                    const token = jwt.sign(req.query,process.env.JWT_SECRET,{expiresIn:'7d'})
                    res.status(200).send({user:req.query,acessToken:token,message:'user signed in successfully'});
                } else {
                    res.status(401).send({ message: 'Incorrect password' });
                }
            }
        })
    } catch (error) {
        res.status(500).send({message:'server error'})
    }
})