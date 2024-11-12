import express from "express";
//import { validate } from "../../middlewares/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
//import { addProductToCartValidation } from "./cart.validation.js";
import * as cart from "../cart/cart.controller.js";
const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), cart.addProductToCart)
  .get(protectedRoutes, allowedTo("user"), cart.getLoggedUserCart);

cartRouter.post(
  "/applycoupon",
  protectedRoutes,
  allowedTo("user"),
  cart.applyCoupon
);

cartRouter
  .route("/:id")
  .delete(
    protectedRoutes,
    allowedTo("user"),
    /*validate(updateReviewValidation)*/ cart.RemoveProductFromCart
  )
  .put(
    protectedRoutes,
    allowedTo("user"),
    //     validate(updateReviewValidation),
    cart.updateQuantity
  );
//   .get(validate(getSpecificReviewValidation), review.getSpecificReview)
//   .delete(
//     protectedRoutes,
//     allowedTo("admin", "user"),
//     validate(deleteReviewValidation),
//     review.deleteReview
//   );

export default cartRouter;
