import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const generateToken = (payload) => 
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err ) {     
            reject(err); 
        } else {    
          resolve(token);
           }
      }
    );
  });

export const verifyToken = (token) => 
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });



export const authenticateUserMiddleware = async (req, res, next) => {
  if (req.headers.authorization) {
    try {
    
      const token = req.headers.authorization.split(" ")[1];
      const decoded = await verifyToken(token);
      console.log("decoded", decoded);
      const user = await userModel.findById(decoded.id);
      if (user) {
        req.user = user;
        console.log("am entered")
        next();
      } else {
        res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(401).json({ message: "provide a token" });
  }
};
