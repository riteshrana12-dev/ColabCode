import { Router } from "express";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.get("/refreshtoken", authController.refreshToken);
authRouter.post("/refreshtoken", authController.refreshToken);
authRouter.post("/logout", authController.logOut);
authRouter.post("/logoutall", authController.logOutAll);
authRouter.post(
  "/delete-account",
  authMiddleware,
  authController.deleteAccount,
);
authRouter.post("/signin", authController.signIn);
authRouter.post("/verifyEmail", authController.verifyEmail);

export default authRouter;
