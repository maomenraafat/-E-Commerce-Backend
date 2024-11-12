import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { categoryModel } from "../../../databases/models/category.model.js";

import slugify from "slugify";
import { deleteone } from "../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addCategory = catchError(async (req, res, next) => {
  console.log(req.file);
  req.body.image = req.file.filename;
  req.body.slug = slugify(req.body.name);
  const category = new categoryModel(req.body);
  await category.save();
  res.status(200).json({ message: "success", category });
});

const getAllCategories = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();
  let result = await apiFeatures.mongoooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.PAGE_NUMBER, result });
});

const getsingleCategory = catchError(async (req, res, next) => {
  const { id } = req.params;
  let category = await categoryModel.findById(id);
  !category && next(new AppError("categoty not found", 404));
  category && res.status(200).json({ message: "success", category });
});
const updateCategory = catchError(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  req.body.slug = slugify(req.body.name);
  let category = await categoryModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // !category && res.status(200).json({ message: "categoty not found " });
  !category && next(new AppError("categoty not found", 404));
  category && res.status(200).json({ message: "success", category });
});

const deleteCategory = deleteone(categoryModel, "category");

export {
  addCategory,
  getAllCategories,
  getsingleCategory,
  updateCategory,
  deleteCategory,
};
