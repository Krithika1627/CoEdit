const express=require("express");
const app=express();
const http=require('http');
const {Server} =require('socket.io');

const server=http.createServer(app);
const io=new Server(server);

const userScocketMap={};

const getAllConnectedClients=(roomId)=>{
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId)=>{
            return{
                socketId,
                username:userScocketMap[socketId],
            }
        }
    );
}

io.on('connection',(socket)=>{
    //console.log(`User connected: ${socket.id}`);

    socket.on('join',({roomId,username})=>{
        const clients=getAllConnectedClients(roomId);

        const usernameTaken=clients.some((client)=>client.username===username);
        if(usernameTaken){
            socket.emit('username-error',{
                message:'Username already taken',
            });
            return;
        }

        userScocketMap[socket.id]=username;
        socket.join(roomId);
        
        //console.log(clients);
        //notify other users that a new user has joined
        const updatedClients=getAllConnectedClients(roomId);
        updatedClients.forEach(({socketId})=>{
            io.to(socketId).emit('joined',{
                clients:updatedClients,
                username,
                socketId:socket.id,
            });
        });
    });

    socket.on('code-change',({roomId,code})=>{
        socket.in(roomId).emit('code-change',{code});
    });

    socket.on('sync-code',({socketId,code})=>{
        io.to(socketId).emit('code-change',{code});
    });

    socket.on('user-typing',({roomId})=>{
        socket.to(roomId).emit('user-typing',{
            socketId:socket.id,
        });
    });

    socket.on('disconnecting',()=>{
        const rooms=[...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit('disconnected',{
                socketId:socket.id,
                username:userScocketMap[socket.id],
            });
        });
        delete userScocketMap[socket.id];
        socket.leave();
    });
});

const PORT=process.env.PORT || 5001;
server.listen(PORT,()=>console.log('server is running'));