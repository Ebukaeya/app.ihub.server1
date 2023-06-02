import express from "express";
import userModel from "../models/userModel.js";

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
    console.log("req.body", req.body);
    
  } catch (error) {
    console.log(error);
  }
});

export default webstoreRouter;
