const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = 6001;

app.use(express.json());
app.use(express.urlencoded({extended:true}))

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

const verifyToken =(req,res,next)=>{
    let authHead = req.headers.authorization;
    console.log("authHead-",authHead);
    if(authHead==undefined){
        res.send({error:"no token provided"})
        return;
    }

    let token = authHead.split(" ")[1];
    console.log("Token-",token);
    jwt.verify(token,"secretkey",(err,decoded)=>{
        if(err){
            res.send({error:"authentication failed"})
        }else{
            // res.send({success:"authentication success",decoded})
            next();
        }
    }) 
}

app.post("/login",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(username==undefined || password==undefined){
        res.status(500).send({error:"authentication failed"})
        return;
    }

    let qr = `select * from users where user_name='${username}' and user_password= sha1('${password}')`;
    connection.query(qr,(err,result)=>{
        if(err || result.length==0){
            //console.log(err);
            res.send({error:"user not found"})
        }else{
           let resp ={
            id:result[0].user_id,
            status:result[0].user_stausus
           }
           let token = jwt.sign(resp,"secretkey",{expiresIn:60});
           res.send({authentication:true,token:token})
        }
    })

})

app.get("/colleges",verifyToken,(req,res)=>{
   let qr = `select * from college`;
   connection.query(qr,(err,result)=>{
    if(err){
        res.send(err)
    }
    res.json(result);
   })
});

app.get("/colleges/:id",(req,res)=>{
    let id = req.params.id;

    let qr = `select * from college where college_id=${id}`;
    connection.query(qr,(err,result)=>{
     if(err){
         res.send(err)
     }
     res.json(result);
    })
 });

app.post("/college",(req,res)=>{
    let college_name = req.body.college_name;
    let college_code = req.body.college_code;
    let college_points = req.body.college_points;

    let qr = `insert into college(college_name,college_code,college_points) values('${college_name}','${college_code}','${college_points}')`;

    connection.query(qr,(err,result)=>{
        if(err){
            console.log(err);
            res.json({error:"insertion failed"})
        }else{
            res.json({success:"insertion success"})
        }
       
    })
})

app.put("/college/:id",(req,res)=>{
    let college_name = req.body.college_name;
    let college_code = req.body.college_code;
    let college_points = req.body.college_points;
    let college_id = req.params.id;

    let qr = `update college set college_name='${college_name}',college_code='${college_code}',college_points='${college_points}' where college_id=${college_id}`;

    connection.query(qr,(err,result)=>{
        if(err){
            console.log(err);
            res.json({error:"updation failed"})
        }else{
            res.json({success:"updation success"})
        }
       
    })
})

app.delete("/colleges/:id",(req,res)=>{
    let id = req.params.id;

    let qr = `delete from college where college_id=${id}`;
    connection.query(qr,(err,result)=>{
     if(err){
        console.log(err);
         res.json({error:"deletion failed"})
     }else{
        res.json({succes:"Data deleted.."});
     }
    
    })
 });


app.listen(PORT,()=>console.log(`Server started on Port ${PORT}`));