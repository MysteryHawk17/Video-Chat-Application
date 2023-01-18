const express=require("express")
const app=express();
const cors=require("cors");
const { Socket } = require("dgram");    
const server=require("http").createServer(app)

const io=require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})
app.use(cors());
const port=process.env.PORT||5000
app.get("/",(req,res)=>{
    res.send("Hello from chat server!!")
})
server.listen(port,()=>{
    console.log(`Server Connected at ${port}`)
})
io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    socket.on('disconnect',()=>{
        socket.broadcast.emit("call ended")
    })
    socket.on('calluser',({userToCall,signalData,from,name})=>{
        io.to(userToCall).emit("calluser",{signal:signalData,from,name})
    })
    socket.on('answercall',(data)=>{
        io.to(data.io).emit("call accepted",data.signal);
    })

})