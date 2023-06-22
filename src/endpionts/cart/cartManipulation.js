import express from "express";
import userModel from "../../models/userModel.js";

const cartRouter = express.Router();

cartRouter.post("/addtocart/:userID", async (req, res, next) => {
  let { product, quantity, size, color } = req.body;
  let { userID } = req.params;

  console.log("req.body", req.body);
  try {
    let user = await userModel.findById(userID);
    if (user) {
      let newCartItem = {
        product,
        quantity,
        size,
        color,
      };

      /* check if product is already in cart */
      let productInCart = user.cart.find((item) => item.product._id === product._id);

      if (productInCart) {
            console.log("product already in cart");
        res.status(400).send({ message: "item already in cart" });
      } else {
        /* if product is not in cart, add it */
        user.cart.push(newCartItem);
        await user.save();

        res.status(200).send({ message: "item added to cart", user });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

cartRouter.patch("/removefromcart/:userID", async (req, res, next) => {
      try {
            let { userID } = req.params;
            let { productID } = req.body;
            let user = await userModel.findById(userID);
            if (user) {
                  let productInCart = user.cart.find((item) => item.product._id === productID);
                  if (productInCart) {
                        console.log("product found in cart and will be removed" );
                        user.cart = user.cart.filter((item) => item.product._id !== productID);
                        await user.save();
                        res.status(200).send({ message: "item removed from cart", user });
                  } else {
                        res.status(400).send({ message: "item not in cart" });
                  }
            }
            
      } catch (error) {
            console.log(error);
      }
});

export default cartRouter;
