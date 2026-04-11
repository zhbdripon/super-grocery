import type { RequestHandler } from "express";
import { ApiError } from "../utils/apiError.js";

export const authorize =
  (...roles: Array<"admin" | "user">): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden("Insufficient permissions");
    }

    next();
  };
