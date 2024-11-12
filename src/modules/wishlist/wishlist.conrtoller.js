import { userModel } from "../../../databases/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

const addToWishlist = catchError(async (req, res, next) => {
  const { product } = req.body;
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: product } },
    {
      new: true,
    }
  );
  !result && next(new AppError("result not found", 404));
  result &&
    res.status(200).json({ message: "success", result: result.wishlist });
});
const removefromWishlist = catchError(async (req, res, next) => {
  const { product } = req.body;
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: product } },
    {
      new: true,
    }
  );
  !result && next(new AppError("result not found", 404));
  result &&
    res.status(200).json({ message: "success", result: result.wishlist });
});
const getAllUserWishlist = catchError(async (req, res, next) => {
  let result = await userModel
    .findOne({ _id: req.user._id })
    .populate("wishlist");
  !result && next(new AppError("result not found", 404));
  result &&
    res.status(200).json({ message: "success", result: result.wishlist });
});

export { addToWishlist, removefromWishlist, getAllUserWishlist };
