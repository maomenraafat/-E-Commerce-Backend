import { subCategoryModel } from "../../../databases/models/Subcategory.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

import slugify from "slugify";
import { deleteone } from "../handlers/factor.js";

const addSubcategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const Subcategory = new subCategoryModel(req.body);
  await Subcategory.save();
  res.status(200).json({ message: "success", Subcategory });
});

const getAllSubCategories = catchError(async (req, res, next) => {
  console.log(req.params);
  let filterObj = {};
  if (req.params.categoryId) {
    filterObj = { category: req.params.categoryId };
    //filterObj = req.params;
  }
  let subcategories = await subCategoryModel.find(filterObj);
  res.status(200).json({ message: "success", subcategories });
});

const updateSubcategory = catchError(async (req, res, next) => {
  const { id } = req.params;
  // const { name } = req.body;
  if (req.body.name) req.body.slug = slugify(req.body.name);
  let Subcategory = await subCategoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // !Subcategory && res.status(200).json({ message: "categoty not found " });
  !Subcategory && next(new AppError("subcategoty not found", 404));
  Subcategory && res.status(200).json({ message: "success", Subcategory });
});

const deleteSubcategory = deleteone(subCategoryModel, "subcategory");

export {
  addSubcategory,
  getAllSubCategories,
  updateSubcategory,
  deleteSubcategory,
};
