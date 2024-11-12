import express from "express";
// import * as brand from "./brand/brand.conrtoller.js";
import * as brand from "./brand.conrtoller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
const brandRouter = express.Router();

brandRouter
  .route("/")
  .post(protectedRoutes, allowedTo("admin"), brand.addBrand)
  .get(brand.getAllBrands);
brandRouter
  .route("/:id")
  .put(protectedRoutes, allowedTo("admin"), brand.updateBrand)
  .delete(protectedRoutes, allowedTo("admin"), brand.deleteBrand);

export default brandRouter;
