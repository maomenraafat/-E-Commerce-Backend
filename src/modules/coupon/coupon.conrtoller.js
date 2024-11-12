import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { deleteone } from "../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { couponModel } from "../../../databases/models/coupon.model.js";
import qrcode from "qrcode";
const addCoupon = catchError(async (req, res, next) => {
  const result = new couponModel(req.body);
  await result.save();
  res.status(201).json({ message: "success", result });
});

const getAllCoupons = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(couponModel.find(), req.query)
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

const getCoupon = catchError(async (req, res, next) => {
  const { id } = req.params;
  let result = await couponModel.findById(id);
  let url = await qrcode.toDataURL(result.code);
  !result && next(new AppError("Coupon not found", 404));
  result && res.status(200).json({ message: "success", result, url });
});
const updateCoupon = catchError(async (req, res, next) => {
  const { id } = req.params;
  let result = await couponModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  !result && next(new AppError("Coupon not found", 404));
  result && res.status(200).json({ message: "success", result });
});

const deleteCoupon = deleteone(couponModel, "Coupon");

export { addCoupon, getAllCoupons, getCoupon, updateCoupon, deleteCoupon };
