import express from "express";
import * as product from "./product.conrtoller.js";
import { uploadMultipleFiles } from "../../multer/multer.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
const productRouter = express.Router();

let arrFields = [
  { name: "imgCover", maxCount: 1 },
  { name: "images", maxCount: 20 },
];

productRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin", "user"),
    uploadMultipleFiles(arrFields, "product"),
    product.addProduct
  )
  .get(product.getAllProducts);
productRouter
  .route("/:id")
  .put(protectedRoutes, allowedTo("admin"), product.updateProduct)
  .get(product.getProduct)
  .delete(protectedRoutes, allowedTo("admin"), product.deleteProduct);

export default productRouter;
