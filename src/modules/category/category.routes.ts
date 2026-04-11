import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { categoryController } from "./category.controller.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";

// non-admin routes
const userCategoryRouter = Router();
userCategoryRouter.use(authenticate);

userCategoryRouter.get("/", asyncHandler(categoryController.findAll));
userCategoryRouter.get("/:id", asyncHandler(categoryController.findById));

// admin routes
const adminCategoryRouter = Router();
adminCategoryRouter.use(authenticate, authorize("admin"));

adminCategoryRouter.post(
  "/",
  validate(createCategorySchema),
  asyncHandler(categoryController.create),
);

adminCategoryRouter.patch(
  "/:id",
  validate(updateCategorySchema),
  asyncHandler(categoryController.update),
);

adminCategoryRouter.delete(
  "/:id",
  asyncHandler(categoryController.remove),
);

export {
  userCategoryRouter as categoryRoutes,
  adminCategoryRouter as adminCategoryRoutes,
};
