import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { orderController } from "./order.controller.js";
import { createOrderSchema } from "./order.validation.js";

const router = Router();

router.use(authenticate, authorize("user", "admin"));
router.post(
  "/",
  validate(createOrderSchema),
  asyncHandler(orderController.create),
);
router.get("/", asyncHandler(orderController.findMyOrders));
router.get("/:id", asyncHandler(orderController.findMyOrderById));

export default router;
