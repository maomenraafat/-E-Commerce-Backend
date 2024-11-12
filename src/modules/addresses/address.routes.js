import express from "express";
import * as addresses from "./address.conrtoller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
const addressesRouter = express.Router();

addressesRouter
  .route("/")
  .patch(protectedRoutes, allowedTo("user"), addresses.addAddress)
  .delete(protectedRoutes, allowedTo("user"), addresses.removeAddress)
  .get(protectedRoutes, allowedTo("user"), addresses.getAllUserAddress);

export default addressesRouter;
