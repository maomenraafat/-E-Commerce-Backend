import express from "express";
import * as user from "./user.conrtoller.js";
const userRouter = express.Router();

userRouter.route("/").post(user.addUser).get(user.getAllUsers);
userRouter
  .route("/:id")
  .put(user.updateUser)
  .delete(user.deleteUser)
  .patch(user.changeUserPassword);

export default userRouter;
