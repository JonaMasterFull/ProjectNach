import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    consecutiveNumber: {
      type: Number,
      required: true,
    },
    encryptedName: {
      type: String,
      required: true,
    },
    storeType: {
      type: String,
      required: true,
      enum: {
        values: ["Elektra", "ShopingBaz"],
        message: "{VALUE} no es un tipo de tienda válido",
      },
    },
  },
  { timestamps: true },
);

userSchema.index({ storeType: 1, consecutiveNumber: 1 }, { unique: true });

export const User = model("User", userSchema);
