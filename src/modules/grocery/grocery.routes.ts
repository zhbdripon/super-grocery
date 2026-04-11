import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { groceryController } from "./grocery.controller.js";
import {
  createGroceryItemSchema,
  updateGroceryItemSchema
} from "./grocery.validation.js";

// admin route
export const adminGroceryRouter = Router();
adminGroceryRouter.use(authenticate, authorize("admin"));

adminGroceryRouter.get("/", asyncHandler(groceryController.findAll));
adminGroceryRouter.get("/:id", asyncHandler(groceryController.findById));
adminGroceryRouter.post(
  "/",
  validate(createGroceryItemSchema),
  asyncHandler(groceryController.create),
);
adminGroceryRouter.patch(
  "/:id",
  validate(updateGroceryItemSchema),
  asyncHandler(groceryController.update),
);
adminGroceryRouter.delete("/:id", asyncHandler(groceryController.remove));

// none admin route
export const userGroceryRouter = Router();
userGroceryRouter.use(authenticate, authorize("user", "admin"));

userGroceryRouter.get("/", asyncHandler(groceryController.findAvailable));
userGroceryRouter.get(
  "/:id",
  asyncHandler(groceryController.findAvailableById),
);
