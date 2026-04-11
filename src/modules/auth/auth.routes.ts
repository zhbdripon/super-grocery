import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import { authController } from "./auth.controller";
import { loginSchema, refreshSchema, registerSchema } from "./auth.validator";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(authController.register),
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(authController.login),
);

router.post(
  "/refresh",
  validate(refreshSchema),
  asyncHandler(authController.refresh),
);

router.post("/logout", authenticate, asyncHandler(authController.logout));

router.delete(
  "/sessions",
  authenticate,
  asyncHandler(authController.logoutAll),
);

export default router;
