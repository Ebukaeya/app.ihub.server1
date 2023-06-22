import userModel from "../models/userModel.js";


const authenticateUserMiddleware = async (req, res, next) => {
      const token = req.headers.authorization;
      try {
      const user = await userModel.findByToken(token);
      if (user) {
            req.user = user;
            next();
      } else {
            res.status(401).send({ message: "Unauthorized" });
      }
      } catch (error) {
      res.status(401).send({ message: "Unauthorized" });
      }
};