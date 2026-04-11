import type { NextFunction, Request, Response } from "express";
import { RequestHandler } from "express";
import type { ZodType } from "zod";
import z from "zod";
import { ApiError } from "../utils/apiError";

export const validate = (
  schema: ZodType<any>,
  source: "body" | "query" | "params" = "body",
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      throw ApiError.badRequest(
        "Validation failed",
        z.treeifyError(result.error),
      );
    }

    req[source] = result.data;
    next();
  };
};
