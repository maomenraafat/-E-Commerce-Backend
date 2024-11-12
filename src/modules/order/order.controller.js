import { cartModel } from "../../../databases/models/cart.model.js";
import { orderModel } from "../../../databases/models/order.model.js";
import { productModel } from "../../../databases/models/product.model.js";
import { catchError } from "../../utils/catchError.js";

const createCashOrder = catchError(async (req, res, next) => {
  //1)get cart (cart id)
  const cart = await cartModel.findById(req.params.id);
  //2) cal total price
  const totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  //3) create order
  const order = new orderModel({
    userId: req.user.id,
    cartItem: cart.cartItem,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  await order.save();
  //4) inc sold &dec quantity
  if (order) {
    let options = cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await productModel.bulkWrite(options);
    //5) clear user cart
    await cartModel.findByIdAndDelete(req.params.id);
    return res.status(201).json({ message: "Success", order });
  } else {
    return next(new AppError("error in cart id", 404));
  }
});

const getSpecificOrder = catchError(async (req, res, next) => {
  let order = await orderModel
    .findOne({ userId: req.user._id })
    .populate("cartItem.product");
  res.status(200).json({ message: "success", order });
});
const getAllOrders = catchError(async (req, res, next) => {
  let orders = await orderModel.find().populate("cartItem.product");
  res.status(200).json({ message: "success", orders });
});

export { createCashOrder, getSpecificOrder, getAllOrders };
