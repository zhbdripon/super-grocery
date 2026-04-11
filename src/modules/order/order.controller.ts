import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { orderService } from "./order.service.js";
import { parsePagination, paginatedResponse } from "../../utils/pagination.js";
import type { CreateOrderInput } from "./order.validation.js";

export class OrderController {
  async create(req: Request, res: Response) {
    const userId = req.user!.userId;
    const input = req.body as CreateOrderInput;
    const order = await orderService.create(userId, input);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  }

  async findMyOrders(req: Request, res: Response) {
    const userId = req.user!.userId;
    const pagination = parsePagination(req);
    const { orders: userOrders, total } = await orderService.findByUser(userId, pagination);

    res.status(StatusCodes.OK).json({
      success: true,
      ...paginatedResponse(userOrders, total, pagination),
    });
  }

  async findMyOrderById(req: Request, res: Response) {
    const userId = req.user!.userId;
    const orderId = parseInt(req.params.id as string, 10);
    const order = await orderService.findByIdForUser(orderId, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: order,
    });
  }
}

export const orderController = new OrderController();
