import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [10, "tooo short product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      maxlength: [
        100,
        " description should be less than or equal to 100 characters",
      ],
      minlength: [10, "tooo short product description"],
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    imgCover: {
      type: String,
      // required: true,
    },
    images: {
      type: [String],
    },
    category: {
      type: Schema.ObjectId,
      ref: "category",
      required: true,
    },
    subCategory: {
      type: Schema.ObjectId,
      ref: "subCategory",
      required: true,
    },
    brand: {
      type: Schema.ObjectId,
      ref: "brand",
      required: true,
    },
    ratingAvg: {
      type: Number,
      min: 1,
      max: 5,
    },
    ratingCount: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.post("init", function (doc) {
  if (doc.imgCover && doc.images) {
    doc.imgCover = process.env.BASE_URL + "product/" + doc.imgCover;
    doc.images = doc.images.map(
      (elm) => process.env.BASE_URL + "product/" + elm
    );
  }
});

productSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "products",
});

productSchema.pre(/^find/, function () {
  this.populate("reviews");
});

export const productModel = model("product", productSchema);
