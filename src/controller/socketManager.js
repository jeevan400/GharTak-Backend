import { Server } from "socket.io";
import cors from "cors";

let io;
export const connectToSocket = (server) => {
  // the connectToSocket are use to connect the http server to socket.io
   io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket)=>{
    console.log("User Connected");

    socket.on("joinRoom", (userId)=>{
        socket.join(userId);
        console.log(`User Joined Room ${userId}`);
    });

    socket.on("message", (data)=>{
        console.log(data);
    })
});

return io;
};

export const getIO = ()=> io;
