import dotenv from "dotenv";

if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

export const environment = {
  PORT: process.env.PORT || 3000,
  URL_DATABASE: process.env.URL_DATABASE || "",
  APP_SECRET: process.env.APP_SECRET || "",
  SALT: process.env.SALT || "",
};
