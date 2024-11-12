import express from "express";
import * as review from "../review/review.conrtoller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), review.addReview)
  .get(review.getAllReviews);

reviewRouter
  .route("/:id")
  .put(protectedRoutes, allowedTo("user"), review.updateReview)
  .get(review.getsingleReview)
  .delete(protectedRoutes, allowedTo("admin", "user"), review.deleteReview);

export default reviewRouter;
