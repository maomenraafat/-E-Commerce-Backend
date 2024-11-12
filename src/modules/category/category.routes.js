import express from "express";
// import * as category from "./category/category.conrtoller.js";
import * as category from "./category.conrtoller.js";
import subcategoryRouter from "../subcategory/subcategory.routes.js";
import {
  addCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
} from "./category.validation.js";
import { validate } from "../../middleware/validate.js";
import { uploadSingleFile } from "../../multer/multer.js";
const categoryRouter = express.Router();

categoryRouter.use("/:categoryId/subcategories", subcategoryRouter);
categoryRouter
  .route("/")
  .post(
    uploadSingleFile("image", "category"),
    validate(addCategoryValidation),
    category.addCategory
  )
  .get(category.getAllCategories);
categoryRouter
  .route("/:id")
  .get(category.getsingleCategory)
  .put(validate(updateCategoryValidation), category.updateCategory)
  .delete(validate(deleteCategoryValidation), category.deleteCategory);

export default categoryRouter;
