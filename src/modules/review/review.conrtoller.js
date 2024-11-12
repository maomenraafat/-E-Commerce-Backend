import { AppError } from "../../utils/AppError.js";
import { catchError } from "../../utils/catchError.js";
import { deleteone } from "../handlers/factor.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import { reviewModel } from "../../../databases/models/review.model.js";

const addReview = catchError(async (req, res, next) => {
  req.body.user = req.user._id;
  let iSReview = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (iSReview) return next(new AppError("you created a review before", 409));
  const Review = new reviewModel(req.body);
  await Review.save();
  res.status(201).json({ message: "success", Review });
});

const getAllReviews = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(reviewModel.find(), req.query)
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

const getsingleReview = catchError(async (req, res, next) => {
  const { id } = req.params;
  let review = await reviewModel.findById(id);
  !review && next(new AppError("review not found", 404));
  review && res.status(200).json({ message: "success", review });
});

const updateReview = catchError(async (req, res, next) => {
  const { id } = req.params;
  // const { name } = req.body;
  let Review = await reviewModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );
  // !Review && res.status(200).json({ message: "categoty not found " });
  !Review &&
    next(
      new AppError(
        "Review not found or you not authorized to perform this action",
        404
      )
    );
  Review && res.status(200).json({ message: "success", Review });
});

const deleteReview = deleteone(reviewModel, "Review");

export {
  addReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getsingleReview,
};
