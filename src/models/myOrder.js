import mongoose from "mongoose";

import pkg from "mongoose";

const { Schema, model, ObjectId } = pkg;


export const OrdersSchema = new Schema({
     orderDate: { type: Date }, 
     paymentID: { type: String },
     purchasedItems:[{}],
     shippingAddress: { type: String },
     paymentMethod: { type: String },
     pickUpInStore: { type: Boolean },
     expectedDeliveryDate: { type: Date },
     totalBreakDown:{
              totalItems: { type: Number },
              subTotal: { type: Number },
              deliveryFee: { type: Number },
              totalPaid: { type: Number },
     },
     orderStatus: { type: String, enum: ["pending", "processing", "shipped", "delivered", "dispute","resolved"] },
     disputeReason: { type: String } || null /* only if orderStatus is dispute */,
     consumerID: { type: ObjectId, ref: "User" },

});

export default model("MyOrders", OrdersSchema);