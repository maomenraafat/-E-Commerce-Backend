import { Schema, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    logo: {
      type: String,
      // required:true
    },
  },
  { timestamps: true }
);

export const brandModel = model("brand", brandSchema);
