import type { RequestHandler } from "express";
import { ApiError } from "../utils/apiError.js";

export const notFound: RequestHandler = (req, _res, _next) => {
  throw ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`);
};
