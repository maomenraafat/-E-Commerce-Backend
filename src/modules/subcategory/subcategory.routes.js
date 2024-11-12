import express from "express";
import * as subcategory from "./subcategory.conrtoller.js";
const subcategoryRouter = express.Router({ mergeParams: true });

subcategoryRouter
  .route("/")
  .post(subcategory.addSubcategory)
  .get(subcategory.getAllSubCategories);
subcategoryRouter
  .route("/:id")
  .put(subcategory.updateSubcategory)
  .delete(subcategory.deleteSubcategory);

export default subcategoryRouter;
