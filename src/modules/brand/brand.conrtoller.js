import { brandModel } from "../../../databases/models/brand.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

import slugify from "slugify";
import { deleteone } from "../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addBrand = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const Brand = new brandModel(req.body);
  await Brand.save();
  res.status(201).json({ message: "success", Brand });
});

const getAllBrands = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(brandModel.find(), req.query)
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

const updateBrand = catchError(async (req, res, next) => {
  const { id } = req.params;
  // const { name } = req.body;
  req.body.slug = slugify(req.body.name);
  let Brand = await brandModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // !Brand && res.status(200).json({ message: "categoty not found " });
  !Brand && next(new AppError("brand not found", 404));
  Brand && res.status(200).json({ message: "success", Brand });
});

const deleteBrand = deleteone(brandModel, "brand");

export { addBrand, getAllBrands, updateBrand, deleteBrand };
