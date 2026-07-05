import { Router } from "express";
import { createUserController } from "../controllers/userController";

const userRouter = Router();

userRouter.post('/users', createUserController);

export default userRouter;