import express from "express";
import userModel from "../models/userModel.js";

const chatRouter = express.Router();

chatRouter.get("/getchatlist/:userID", async (req, res, next) => {
  try {
    let user = await userModel.findById(req.params.userID);
    if(user){
      let chats = user.conversations;
      res.status(200).send(chats);
    }else{
      res.status(400).send({message:"user not found"})
    }
  } catch (error) {
    console.log(error);
  }
});

export default chatRouter;
