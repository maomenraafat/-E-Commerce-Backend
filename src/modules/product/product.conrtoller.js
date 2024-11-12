import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import slugify from "slugify";
import { deleteone } from "../handlers/factor.js";
import { productModel } from "../../../databases/models/product.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

const addProduct = catchError(async (req, res, next) => {
  req.body.imgCover = req.files.imgCover[0].filename;
  req.body.images = req.files.images.map((elm) => elm.filename);
  console.log(req.body.imgCover, req.body.images);
  // req.body.images = req.files.images.map((elm) => {
  //   return elm.filename;
  // });
  req.body.slug = slugify(req.body.title);
  const Product = new productModel(req.body);
  await Product.save();
  res.status(200).json({ message: "success", Product });
});

const getAllProducts = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
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

const getProduct = catchError(async (req, res, next) => {
  const { id } = req.params;
  let Product = await productModel.findById(id);
  !Product && next(new AppError("Product not found", 404));
  Product && res.status(200).json({ message: "success", Product });
});
const updateProduct = catchError(async (req, res, next) => {
  const { id } = req.params;
  // const { name } = req.body;
  if (req.body.title) req.body.slug = slugify(req.body.title);
  let Product = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // !Product && res.status(200).json({ message: "categoty not found " });
  !Product && next(new AppError("Product not found", 404));
  Product && res.status(200).json({ message: "success", Product });
});

const deleteProduct = deleteone(productModel, "Product");

export { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct };
