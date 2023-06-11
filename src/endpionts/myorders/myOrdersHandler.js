import express from "express";
import myOrderModel from "../../models/myOrder.js";

const myOrdersRouter = express.Router();

myOrdersRouter.get("/fetchOrders/:consumerID", async (req, res, next) => {
      try {
      let { consumerID } = req.params;
      let myOrders = await myOrderModel.find({ consumerID });
      res.status(200).send(myOrders);
      } catch (error) {
      console.log(error);
      }
});





export default myOrdersRouter;