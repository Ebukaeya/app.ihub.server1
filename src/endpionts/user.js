import express from "express";
import userModel from "../models/userModel.js";

const userRouter = express.Router();

userRouter.post("/signup", async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const { email } = req.body;
    const foundUser = await userModel.findOne({ email });
    console.log("foundUser", foundUser);
    if (foundUser) {
      res.status(400).json({ message: "email already exists" });
    } else {
      let userMod = {
        ...req.body,
        imageUrl:
          "https://res.cloudinary.com/ebuka1122/image/upload/v1658908933/samples/Ihub-Consumer-App/person-placeholder_ecfndv.jpg",
      };
      const newUser = new userModel(userMod);
      const user = await newUser.save();
      res.json(user);
    }
  } catch (error) {
    console.log(error);
  }
});

userRouter.put("/updatecart/:userID", async (req, res, next) => {
  try {
    console.log(req.body);
    let user = await userModel.findById(req.params.userID);
    user.cart = req.body;
    await user.save();
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

userRouter.put("/updateprofile/:userID", async (req, res, next) => {
  try {
    console.log("updating profile address");
    let user = await userModel.findById(req.params.userID);
    user.address = req.body;
    user.deliveryAddress = req.body;
    await user.save();
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
