import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";

import slugify from "slugify";
import { deleteone } from "../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { userModel } from "../../../databases/models/user.model.js";

const addUser = catchError(async (req, res, next) => {
  const User = new userModel(req.body);
  await User.save();
  res.status(200).json({ message: "success", User });
});

const getAllUsers = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(userModel.find(), req.query)
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

const updateUser = catchError(async (req, res, next) => {
  const { id } = req.params;
  // const { name } = req.body;
  let User = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // !User && res.status(200).json({ message: "categoty not found " });
  !User && next(new AppError("User not found", 404));
  User && res.status(200).json({ message: "success", User });
});
const changeUserPassword = catchError(async (req, res, next) => {
  const { id } = req.params;
  // const { name } = req.body;
  req.body.passwordChangeAt = Date.now();
  let User = await userModel.findByIdAndUpdate(
    id,
    { password: req.body.password },
    { new: true }
  );
  // !User && res.status(200).json({ message: "categoty not found " });
  !User && next(new AppError("User not found", 404));
  User && res.status(200).json({ message: "success", User });
});

const deleteUser = deleteone(userModel, "User");

export { addUser, getAllUsers, updateUser, deleteUser, changeUserPassword };
