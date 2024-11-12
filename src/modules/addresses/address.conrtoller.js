import { userModel } from "../../../databases/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

const addAddress = catchError(async (req, res, next) => {
  let result = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {
      new: true,
    }
  );
  !result && next(new AppError("result not found", 404));
  result &&
    res.status(200).json({ message: "success", result: result.addresses });
});
// const removeAddress = catchError(async (req, res, next) => {
//   let result = await userModel.findByIdAndUpdate(
//     req.user._id,
//     { $pull: { addrresses: { _id: req.body.address } } },
//     {
//       new: true,
//     }
//   );
//   !result && next(new AppError("result not found", 404));
//   result &&
//     res.status(200).json({ message: "success", result: result.addresses });
// });
const removeAddress = catchError(async (req, res, next) => {
  const removeAddress = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.body.address } } },
    { new: true }
  );
  removeAddress &&
    res.status(201).json({
      message: "success",
      removeAddress: removeAddress.addresses,
    });
  !removeAddress && next(new AppError("Address was not found", 404));
});

const getAllUserAddress = catchError(async (req, res, next) => {
  let result = await userModel.findOne({ _id: req.user._id });
  !result && next(new AppError("result not found", 404));
  result &&
    res.status(200).json({ message: "success", result: result.addresses });
});

export { addAddress, removeAddress, getAllUserAddress };
