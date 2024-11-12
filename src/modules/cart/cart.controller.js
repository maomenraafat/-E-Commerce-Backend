import { catchError } from "../../utils/catchError.js";
import { AppError } from "../../utils/AppError.js";
import { cartModel } from "../../../databases/models/cart.model.js";
import { productModel } from "../../../databases/models/product.model.js";
import { couponModel } from "../../../databases/models/coupon.model.js";

function calcTotalPrice(cart) {
  let totalPrice = 0;
  cart.cartItem.forEach((elm) => {
    totalPrice += elm.quantity * elm.price;
  });

  cart.totalPrice = totalPrice;
}

const addProductToCart = catchError(async (req, res, next) => {
  let product = await productModel.findById(req.body.product).select("price");
  if (!product) return next(new AppError("Product was not found", 404));
  req.body.price = product.price;
  let isCartExist = await cartModel.findOne({
    userId: req.user._id,
  });

  if (!isCartExist) {
    let result = new cartModel({
      userId: req.user._id,
      cartItem: [req.body],
    });
    calcTotalPrice(result);

    await result.save();
    return res.status(201).json({ message: "success", result });
  }
  console.log(isCartExist.cartItem);

  let item = isCartExist.cartItem.find((elm) => {
    return elm.product == req.body.product;
  });
  if (item) {
    item.quantity += req.body.quantity || 1;
  } else {
    isCartExist.cartItem.push(req.body);
  }
  calcTotalPrice(isCartExist);
  if (isCartExist.discount) {
    isCartExist.totalPriceAfterDiscount =
      isCartExist.totalPrice -
      (isCartExist.totalPrice * isCartExist.discount) / 100;
  }
  await isCartExist.save();
  res.status(201).json({ message: "add to cart", result: isCartExist });
});

const RemoveProductFromCart = catchError(async (req, res, next) => {
  let result = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { cartItem: { _id: req.params.id } } },
    { new: true }
  );
  //console.log(result);
  !result && next(new AppError("item was not found", 404));
  calcTotalPrice(result);
  if (result.discount) {
    result.totalPriceAfterDiscount =
      result.totalPrice - (result.totalPrice * result.discount) / 100;
  }
  result && res.status(201).json({ message: "success", cart: result });
});

const updateQuantity = catchError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id).select("price");
  if (!product) return next(new AppError("Product was not found", 404));
  let isCartExist = await cartModel.findOne({ userId: req.user._id });
  let item = isCartExist.cartItem.find((elm) => {
    return elm.product == req.params.id;
  });
  if (item) {
    item.quantity = req.body.quantity;
  }
  calcTotalPrice(isCartExist);
  if (isCartExist.discount) {
    isCartExist.totalPriceAfterDiscount =
      isCartExist.totalPrice -
      (isCartExist.totalPrice * isCartExist.discount) / 100;
  }
  await isCartExist.save();
  res.status(201).json({ message: "add to cart", result: isCartExist });
});

const applyCoupon = catchError(async (req, res, next) => {
  let coupon = await couponModel.findOne({
    code: req.body.code,
    expires: { $gt: Date.now() },
  });
  let cart = await cartModel.findOne({ userId: req.user._id });

  cart.totalPriceAfterDiscount =
    cart.totalPrice - (cart.totalPrice * coupon.discount) / 100;
  cart.discount = coupon.discount;
  await cart.save();
  res.status(201).json({ message: "success", cart });
});
const getLoggedUserCart = catchError(async (req, res, next) => {
  let cartItems = await cartModel
    .findOne({
      userId: req.user._id,
    })
    .populate("cartItem.product");
  let cart = await cartModel.findOne({ userId: req.user._id });
  res.status(201).json({ message: "success", cart: cartItems });
});

export {
  addProductToCart,
  RemoveProductFromCart,
  updateQuantity,
  applyCoupon,
  getLoggedUserCart,
};
