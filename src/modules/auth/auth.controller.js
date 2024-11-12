import { userModel } from "../../../databases/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const signUp = catchError(async (req, res, next) => {
  let isUser = await userModel.findOne({ email: req.body.email });
  if (isUser) return next(new AppError("account already exists", 409));
  const user = new userModel(req.body);
  await user.save();
  let token = jwt.sign(
    { email: user.email, name: user.name, id: user._id, role: user.role },
    "mynameistoken"
  );
  res.status(201).json({ message: "success", /*user*/ token });
});

const signIn = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password))
    return next(new AppError("account already exists", 409));
  let token = jwt.sign(
    { email: user.email, name: user.name, id: user._id, role: user.role },
    "mynameistoken"
  );
  res.status(201).json({ message: "success", /*user*/ token });
});

const protectedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;
  if (!token) return next(new AppError("token not provided", 401));

  let decoded = await jwt.verify(token, "mynameistoken");
  console.log(decoded);
  let user = await userModel.findById(decoded.id);
  console.log(user);
  if (!user) return next(new AppError("invalid token11", 401));

  // let changePasswordDate = parseInt(user.passwordChangeAt.getTime() / 1000);
  // if (changePasswordDate > decoded.iat)
  //   return next(new AppError("invalid token22", 401));
  if (user.passwordChangeAt) {
    let passwordChangedAt = parseInt(user.passwordChangeAt.getTime() / 1000);
    if (passwordChangedAt > decoded.iat)
      return next(new AppError("Invalid token", 401));
  }

  req.user = user;
  next();
});

const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          `You are not authorized to access this route. Your are ${req.user.role}`,
          401
        )
      );
    next();
  });
};

export { signUp, signIn, protectedRoutes, allowedTo };
