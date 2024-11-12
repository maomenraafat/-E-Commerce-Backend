import express from "express";
//import { validate } from "../../middlewares/validate.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
//import { addProductToCartValidation } from "./cart.validation.js";
import * as order from "../order/order.controller.js";
const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(protectedRoutes, allowedTo("user"), order.getSpecificOrder);
orderRouter.get("/all", order.getAllOrders);
//.post(protectedRoutes, allowedTo("user"), cart.addProductToCart)

orderRouter
  .route("/:id")
  .post(
    protectedRoutes,
    allowedTo("user"),
    /*validate(updateReviewValidation)*/ order.createCashOrder
  );

export default orderRouter;
