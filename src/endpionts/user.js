import express from "express";
import userModel from "../models/userModel.js";
import { generateToken, verifyToken } from "../auth/token.js";
import { authenticateUserMiddleware } from "../auth/token.js";
import { cloudUpload } from "../tools/uploadImage.js";

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
      let { _id } = user.toObject();
      const token = await generateToken({ id: _id });
      console.log("token", token);
      res.status(201).send({ ...user.toObject(), token });
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

userRouter.put("/updateprofileAddress/:userID", async (req, res, next) => {
  try {
    console.log("updating profile address");
    let { address, phoneNumber } = req.body;
    let user = await userModel.findById(req.params.userID);
    user.address = address;
    user.deliveryAddress = address;
    user.phoneNumber = phoneNumber;
    await user.save();
    console.log(user);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

userRouter.put("/updateprofile", authenticateUserMiddleware, async(req,res, next)=>{
try {
  let user = req.user;
  user.gender= req.body.gender;
  user.dateOfBirth= req.body.dateOfBirth;
  await user.save();
  res.status(200).send(user);

  
} catch (error) {
  console.log(error);
}
})


userRouter.put("/uploadImage", authenticateUserMiddleware, cloudUpload, async(req, res, next) => {
try {
  console.log("req.file", req.file);
     let image =req.file.path;
     let user = req.user;
      user.imageUrl = image;
      await user.save();
      res.status(200).send(user);

} catch (error) {
  console.log(error);
  
}
});

export default userRouter;
