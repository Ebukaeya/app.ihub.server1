import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import userRouter from "./endpionts/user.js";
import webstoreRouter from "./endpionts/webstore.js";
import chatRouter from "./endpionts/chats.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketConnection } from "./socketconnections/index.js";
import myOrdersRouter from "./endpionts/myorders/myOrdersHandler.js";
import cartRouter from "./endpionts/cart/cartManipulation.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

/* routes */
app.use("/consumers", userRouter);
app.use("/webstore", webstoreRouter) /* uses a hard coded encryption token */
app.use("/chats", chatRouter)  /* must be tokenized */
app.use("/myorders", myOrdersRouter) /* must be tokenized */
app.use("/cart", cartRouter) /* must be tokenized */

/* errorhandlers */

const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  console.log("am here");
  res.send("hello");
});

const options = {
  dbName: process.env.MONGO_CONSUMER_DB,
};

/* socket connections */

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

socketConnection(io);



try {
    mongoose.connect(process.env.MONGO_CONNECTION,options, () => {
        console.log("connected to mongo");
      
        try {
            httpServer.listen(port, options, () => {
            console.log(`listening on port ${port}`);
            console.table(listEndpoints(app));
          });
        } catch (error) {
          console.log(error);
        }
      });
} catch (error) {
    console.log("mongo connection failed", error);
}


/* create a new socket */