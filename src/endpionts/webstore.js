import express from "express";
import userModel from "../models/userModel.js";
import myOrderModel from "../models/myOrder.js";
import mongoose from "mongoose";

const webstoreRouter = express.Router();

export const socketHelper = (socket) => {};

/* endpoint that receives chats from webstore server */

webstoreRouter.post("/chat", async (req, res, next) => {
  console.log("req.body", req.body);
  /* conversation payload is receieved. use consumer Id to find consumer and create a conversation object if no conversation exists */

  const { message, consumerID, storeOwnerID, storeID, conversationID, businessName, businessImage, isMessageFromStore } = req.body;

  /* let { consumerID } = senderInfo; */

  try {
    let consumer = await userModel.findById(consumerID);
    if (consumer) {
      console.log("consumer found");
      let conversation = consumer.conversations.find((conversation) => conversation.conversationID === conversationID);
      if (conversation) {
        console.log("conversation found");
        conversation.chats.push({ message, senderID: isMessageFromStore ? storeID : consumerID, time: Date.now(), seen: false });
        conversation.business.lastMessage = message;
        await consumer.save();
        res.status(200).send({ consumer, currentConversation: conversation });
      } else {
        console.log("conversation not found");
        let newConversation = {
          conversationID,
          business: { id: storeID, NameOfBusiness: businessName, profileImage: businessImage, lastMessage: message, businessType: "store", storeOwnerID },
          chats: [{ message, senderID: isMessageFromStore ? storeID : consumerID, time: Date.now(), seen: false }],
        };

        consumer.conversations.push(newConversation);
        await consumer.save();
        res.status(200).send({ consumer, currentConversation: newConversation });
      }
    } else {
      console.log("user not found fatal error");
      res.status(400).send({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
  }
});

/* endpoint that creates a new my order when consumer makes purchases */

webstoreRouter.post("/createMyorders", async (req, res, next) => {
  try {
    let { consumerOrderID, paymentID, purchasedItems, shippingAddress, paymentMethod, pickUpInStore, totalbreakDown, totalPaid, profile } = req.body;
    /*  console.log("req.body", req.body); */

    let newOrder = new myOrderModel({
      orderDate: Date.now(),
      consumerOrderID,
      paymentID,
      purchasedItems,
      shippingAddress,
      paymentMethod,
      pickUpInStore,
      totalBreakDown: {
        totalItems: purchasedItems.length,
        subTotal: totalbreakDown.subtotal,
        deliveryFee: totalbreakDown.deliveryFee,
        totalPaid,
        orderStatus: "pending",
      },
      consumerID: mongoose.Types.ObjectId(profile._id),
      orderStatus: "pending",
    });

    console.log(newOrder);
    await newOrder.save();
    res.status(200).send({ message: "order created successfully", newOrder });
  } catch (error) {
    console.log(error);
  }
});

webstoreRouter.patch("/UpdateCOnsumerOrder", async (req, res, next) => {
  let { consumerOrderID, productID, deliveryStatus,disputeReason, disputeRaisedDate,disputeResolvedDate } = req.body; /* productID is an array */

  console.log("req.body", req.body);

  try {
    let consumerOrders = await myOrderModel.findOne({ consumerOrderID });
    if (consumerOrders) {
   /*    let updatedPurchasedItems = consumerOrders.purchasedItems.map((item) => {
      for (let i = 0; i < productID.length; i++) {
        if (item._id.toString() === productID[i].toString()) {
          console.log("item found");
          item.deliveryStatus = deliveryStatus;
          item.unit = "mastercase";
        }
      }
      return item;
      }); */

      consumerOrders.purchasedItems.forEach((item,i,arr) => {
        for (let i = 0; i < productID.length; i++) {
          if (item._id.toString() === productID[i].toString()) {
            console.log("item found",arr);
            
            let updateDProduct = {...item,deliveryStatus:deliveryStatus, disputeReason, disputeRaisedDate,disputeResolvedDate};
            arr[i] = updateDProduct;
            
          }
        }
      });

      console.log("updatenewcheckdPurchasedItems", consumerOrders.purchasedItems);
     /*  consumerOrders.purchasedItems = [...updatedPurchasedItems]; */

      /* checking if all orders are shipped or delivered */
      let isAllOrderShipped = consumerOrders.purchasedItems.every((item) => item.deliveryStatus === "shipped");
      let isAllOrderDelivered = consumerOrders.purchasedItems.every((item) => item.deliveryStatus === "delivered" || item.deliveryStatus === "resolved");
      if (isAllOrderShipped) {
        console.log("all orders are shipped");
        consumerOrders.orderStatus = "shipped";
      }
      if (isAllOrderDelivered) {
        console.log("all orders are delivered");
        consumerOrders.orderStatus = "delivered";
      }

    let savedOrder = await consumerOrders.save();
       /*  console.log("consumerOrders", consumerOrders,saved); */
      res.status(200).send({ message: "order updated successfully", savedOrder });


    }
  } catch (error) {
    console.log(error);
  }
});

export default webstoreRouter;
