const express = require('express');
const mysql = require('mysql');

const app = express();

const PORT = 6001;

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'api_auth'
})

connection.connect((err)=>{
    if(err){
     console.log("error : DB not connected")
     return;
    }
    console.log("success: Mysql db connected...")
})

app.get("/",(req,res)=>{
    res.send({message:"Welcome to Api authorization"});
});

app.listen(PORT,()=>console.log(`Server started on Port ${PORT}`));