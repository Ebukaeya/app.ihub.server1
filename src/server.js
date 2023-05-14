import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import userRouter from "./endpionts/user.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

/* routes */
app.use("/consumers", userRouter);

/* errorhandlers */

const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  console.log("am here");
  res.send("hello");
});

const options = {
  DB_NAME: process.env.MONGO_CONSUMER_DB,
};



try {
    mongoose.connect(process.env.MONGO_CONNECTION, () => {
        console.log("connected to mongo");
      
        try {
          app.listen(port, options, () => {
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
