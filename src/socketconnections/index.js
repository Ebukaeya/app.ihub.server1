


export const socketConnection = async(io) => {

io.on("connection", (socket) => {
      console.log("connected");
      socket.on("createRoom", (room) => {
            console.log("joined", room);
            socket.join(room);
            }
      );
      
});

};