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

const router = Router();

router.use(authenticate);

router.get("/", asyncHandler(categoryController.findAll));
router.get("/:id", asyncHandler(categoryController.findById));

router.post(
  "/",
  authorize("admin"),
  validate(createCategorySchema),
  asyncHandler(categoryController.create),
);

router.patch(
  "/:id",
  validate(updateCategorySchema),
  authorize("admin"),
  asyncHandler(categoryController.update),
);

router.delete(
  "/:id",
  authorize("admin"),
  asyncHandler(categoryController.remove),
);

export default router;
