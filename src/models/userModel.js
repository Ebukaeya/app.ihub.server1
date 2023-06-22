import mongoose from "mongoose";
import bcrypt from "bcrypt";
import pkg from "mongoose";

const { Schema, model, ObjectId } = pkg;



const CartSchema = new Schema({});

const ConversationSchema = new Schema({
  conversationID: { type: String, unique: true } /* manually generated userID+storeID */,
  business: {
    id: { type: ObjectId },
    NameOfBusiness: { type: String },
    profileImage: { type: String },
    lastMessage: { type: String } /* last message sent by the customer (current message) */,
    businessType: { type: String, enum: ["store", "service", "logistic", "restaurant"] },
    storeOwnerID: { type: ObjectId },
  },
  chats: [
    {
      senderID: { type: ObjectId },

      message: { type: String },
      time: { type: Date },
      seen: { type: Boolean },
    },
  ],
});

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
    },
    deliveryAddress: {
      type: Object,
    },
    phoneNumber: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    gender: {
      type: String,
    },
    myOrders: [{ type: ObjectId, ref: "MyOrders" }],

    conversations: [ConversationSchema],
    dateOfBirth: {
      type: String,
    },

    cart: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

/* hash password before saving */

UserSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

/* toJson */

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

/* check credentials */

UserSchema.methods.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    return false;
  } else {
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      return user;
    } else {
      return false;
    }
  }
};

export default model("User", UserSchema);
