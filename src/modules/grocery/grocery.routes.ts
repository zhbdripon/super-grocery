import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { groceryController } from "./grocery.controller.js";
import {
  createGroceryItemSchema,
  updateGroceryItemSchema,
} from "./grocery.validation.js";

// admin route
const adminGroceryRouter = Router();
adminGroceryRouter.use(authenticate, authorize("admin"));

/**
 * @swagger
 * /admin/grocery-items:
 *   get:
 *     tags: [Grocery Items (Admin)]
 *     summary: List all grocery items (admin)
 *     description: Returns all grocery items regardless of stock level. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - $ref: '#/components/parameters/CategoryIdParam'
 *     responses:
 *       200:
 *         description: Paginated list of grocery items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GroceryItemWithCategory'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — admin only
 */
adminGroceryRouter.get("/", asyncHandler(groceryController.findAll));

/**
 * @swagger
 * /admin/grocery-items/{id}:
 *   get:
 *     tags: [Grocery Items (Admin)]
 *     summary: Get a grocery item by ID (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Grocery item UUID
 *     responses:
 *       200:
 *         description: Grocery item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GroceryItemWithCategory'
 *       404:
 *         description: Item not found
 */
adminGroceryRouter.get("/:id", asyncHandler(groceryController.findById));

/**
 * @swagger
 * /admin/grocery-items:
 *   post:
 *     tags: [Grocery Items (Admin)]
 *     summary: Add a new grocery item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroceryItemInput'
 *     responses:
 *       201:
 *         description: Grocery item created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GroceryItem'
 *       400:
 *         description: Invalid input or category not found
 */
adminGroceryRouter.post(
  "/",
  validate(createGroceryItemSchema),
  asyncHandler(groceryController.create),
);

/**
 * @swagger
 * /admin/grocery-items/{id}:
 *   patch:
 *     tags: [Grocery Items (Admin)]
 *     summary: Update a grocery item's details
 *     description: Update name, price, quantityUnit, or categoryId. Does not modify inventory.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Grocery item UUID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGroceryItemInput'
 *     responses:
 *       200:
 *         description: Grocery item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GroceryItem'
 *       400:
 *         description: Category not found
 *       404:
 *         description: Item not found
 */
adminGroceryRouter.patch(
  "/:id",
  validate(updateGroceryItemSchema),
  asyncHandler(groceryController.update),
);

/**
 * @swagger
 * /admin/grocery-items/{id}:
 *   delete:
 *     tags: [Grocery Items (Admin)]
 *     summary: Remove a grocery item from the system
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Grocery item UUID
 *     responses:
 *       200:
 *         description: Grocery item deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Item not found
 */
adminGroceryRouter.delete("/:id", asyncHandler(groceryController.remove));

// non-admin route
const userGroceryRouter = Router();
userGroceryRouter.use(authenticate, authorize("user", "admin"));

/**
 * @swagger
 * /grocery-items:
 *   get:
 *     tags: [Grocery Items (User)]
 *     summary: List available grocery items
 *     description: Returns only items with quantity > 0 (in stock).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParam'
 *       - $ref: '#/components/parameters/LimitParam'
 *       - $ref: '#/components/parameters/SearchParam'
 *       - $ref: '#/components/parameters/CategoryIdParam'
 *     responses:
 *       200:
 *         description: Paginated list of available grocery items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GroceryItemWithCategory'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       401:
 *         description: Unauthorized
 */
userGroceryRouter.get("/", asyncHandler(groceryController.findAvailable));

/**
 * @swagger
 * /grocery-items/{id}:
 *   get:
 *     tags: [Grocery Items (User)]
 *     summary: Get a specific grocery item by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Grocery item UUID
 *     responses:
 *       200:
 *         description: Grocery item details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/GroceryItemWithCategory'
 *       404:
 *         description: Item not found
 */
userGroceryRouter.get(
  "/:id",
  asyncHandler(groceryController.findAvailableById),
);

export {
  userGroceryRouter as userGroceryRoutes,
  adminGroceryRouter as adminGroceryRoutes,
};
