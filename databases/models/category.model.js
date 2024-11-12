import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [2, "tooo short category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);
categorySchema.post("init", function (doc) {
  // console.log(doc);
  doc.image = process.env.BASE_URL + "/category/" + doc.image;
});

export const categoryModel = model("category", categorySchema);
