import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { paginatedResponse, parsePagination } from "../../utils/pagination";
import { categoryService } from "./category.service.js";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation.js";

export class CategoryController {
  async create(req: Request, res: Response) {
    const input = req.body as CreateCategoryInput;
    const category = await categoryService.create(input);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: category,
    });
  }

  async findAll(req: Request, res: Response) {
    const pagination = parsePagination(req);
    const search = req.query.search as string | undefined;
    const { items, total } = await categoryService.findAll(pagination, search);

    res.status(StatusCodes.OK).json({
      success: true,
      ...paginatedResponse(items, total, pagination),
    });
  }

  async findById(req: Request, res: Response) {
    const id = req.params.id as string;
    const category = await categoryService.findById(id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: category,
    });
  }

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const input = req.body as UpdateCategoryInput;
    const category = await categoryService.update(id, input);

    res.status(StatusCodes.OK).json({
      success: true,
      data: category,
    });
  }

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    await categoryService.remove(id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Category deleted",
    });
  }
}

export const categoryController = new CategoryController();
