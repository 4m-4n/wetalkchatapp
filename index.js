import http from "http";
import  express from "express";
import {Server} from "socket.io";
const app=express();
const users=[{}];
const port=process.env.PORT;
app.get("/",(req,res)=>{
    res.send("workingg");
})
const server=http.createServer(app);
const io=new Server(server,{
    cors:{

    }
});
io.on("connection",(socket)=>{
    console.log("new connection ");
    socket.on("joined",({user})=>{
     users[socket.id]=user;   
     console.log(`${user} has joined`);
     socket.broadcast.emit("userjoined",{user:"Admin",message: `${users[socket.id]} has joined`})
     socket.emit("welcome",{user:"Admin" ,message:`welcome to the chat,${users[socket.id]}`});
    })
    socket.on("message",({message,id})=>{
     io.emit("sendmsg",{user:users[id],message,id});
    })
    socket.on("disconnect",()=>{
        socket.broadcast.emit("userleft",{user:"Admin",message: `${users[socket.id]} has left`})
        console.log(`user left`);
    })
    
})
server.listen(port,()=>{
console.log("server is running on port 5500");
})
