import express, { Application } from "express";
import cors from "cors";
import path from "path";
import userRouter from "./routes/user.route";

export const createApp = (): Application => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          "https://frontendnach.netlify.app",
          "http://localhost:5173",
        ];

        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("❌ Acceso denegado por CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );

  app.use(express.static(path.join(__dirname, "../public")));
  app.use("/api", userRouter);
  return app;
}
