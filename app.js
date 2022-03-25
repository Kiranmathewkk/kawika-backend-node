const express = require("express")
const app = express()
const cors =require("cors");
bodyParser = require('body-parser');
const path = require('path');
const url = require('url')
var http = require('http');
//app.use(cors)
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
 
 app.use(cors(corsOptions))
 app.use(express.static(__dirname));
const userRouter = require("./api/users/user.router")
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false}))
app.set('view engine', 'ejs');
app.use("/api/users",userRouter);

// app.get('/api',(req,res)=>{
//     res.json({
//         success:201,
//         message:"working"
//     })
// })
//var url1 = url.parse()
app.listen(3000,()=>{
    console.log("connected to port 3000")
})
app.get("/",function(req,res){
  res.send("<h1>hello world</h1>")
  console.log( req.protocol+"://"+req.headers.host)
});
