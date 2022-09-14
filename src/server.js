import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import userRouter from "./endpionts/user.js";



const app = express();
app.use(express.json()) 
app.use(cors(
    {origin: "*"}
))


/* routes */
app.use("/users", userRouter);

/* errorhandlers */


const port = process.env.PORT || 5001;

app.get("/", (req,res)=>{
    console.log("am here")
    res.send("hello")
})



mongoose.connect(process.env.MONGO_CONNECTION, ()=>{
    console.log("connected to mongo")

    app.listen(port, ()=>{
        
        console.log(`listening on port ${port}`)
        console.table(listEndpoints(app));
    }
    )
})