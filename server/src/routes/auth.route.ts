import { Router } from "express";
import authController from "../controllers/auth.controller";
const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.get("/refreshtoken", authController.refreshToken);
authRouter.get("/logout", authController.logOut);
authRouter.get("/logoutall", authController.logOutAll);
authRouter.post("/signin", authController.signIn);
authRouter.post("/verifyEmail", authController.verifyEmail);

export default authRouter;
