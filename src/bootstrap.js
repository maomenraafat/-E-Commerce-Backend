import { globalError } from "./middleware/globalErrorMiddleware.js";
import addressesRouter from "./modules/addresses/address.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import brandRouter from "./modules/brand/brand.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import couponRouter from "./modules/coupon/coupon.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import productRouter from "./modules/product/product.routes.js";
import reviewRouter from "./modules/review/review.routes.js";
import subcategoryRouter from "./modules/subcategory/subcategory.routes.js";
import userRouter from "./modules/user/user.routes.js";
import wishlistRouter from "./modules/wishlist/wishlist.routes.js";
import { AppError } from "./utils/AppError.js";

export function bootstrap(app) {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subcategories", subcategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/addresses", addressesRouter);
  app.use("/api/v1/coupons", couponRouter);
  app.use("/api/v1/carts", cartRouter);
  app.use("/api/v1/orders", orderRouter);

  app.get("/", (req, res) => res.send("Hello World!"));
  app.all("*", (req, res, next) => {
    next(new AppError("not found endpoint", 404));
  });
  app.use(globalError);
}
