import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { paginatedResponse, parsePagination } from "../../utils/pagination.js";
import { groceryService } from "./grocery.service.js";
import type {
  CreateGroceryItemInput,
  UpdateGroceryItemInput,
  UpdateInventoryInput,
} from "./grocery.validation.js";

export class GroceryController {
  async create(req: Request, res: Response) {
    const input = req.body as CreateGroceryItemInput;
    const item = await groceryService.create(input);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: item,
    });
  }

  async findAll(req: Request, res: Response) {
    const pagination = parsePagination(req);
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId
      ? (req.query.categoryId as string)
      : undefined;

    const { items, total } = await groceryService.findAll(pagination, {
      search,
      categoryId,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      ...paginatedResponse(items, total, pagination),
    });
  }

  async findById(req: Request, res: Response) {
    const id = req.params.id as string;
    const item = await groceryService.findById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: item,
    });
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const input = req.body as UpdateGroceryItemInput;
    const item = await groceryService.update(id, input);

    res.status(StatusCodes.OK).json({
      success: true,
      data: item,
    });
  }

  async updateInventory(req: Request, res: Response) {
    const id = req.params.id as string;
    const input = req.body as UpdateInventoryInput;
    const item = await groceryService.updateInventory(id, input);

    res.status(StatusCodes.OK).json({
      success: true,
      data: item,
    });
  }

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    await groceryService.remove(id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Grocery item deleted",
    });
  }

  async findAvailable(req: Request, res: Response) {
    const pagination = parsePagination(req);
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId
      ? (req.query.categoryId as string)
      : undefined;

    const { items, total } = await groceryService.findAvailable(pagination, {
      search,
      categoryId,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      ...paginatedResponse(items, total, pagination),
    });
  }

  async findAvailableById(req: Request, res: Response) {
    const id = req.params.id as string;
    const item = await groceryService.findById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: item,
    });
  }
}

export const groceryController = new GroceryController();
