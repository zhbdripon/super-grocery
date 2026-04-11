import type { Request } from "express";
import { PAGINATION } from "../configs/constants.js";
import type { PaginationMeta, PaginatedResponse } from "../types/index.js";

export interface PaginationQuery {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(req: Request): PaginationQuery {
  const page = Math.max(
    1,
    parseInt(req.query.page as string, 10) || PAGINATION.DEFAULT_PAGE,
  );
  
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(
      1,
      parseInt(req.query.limit as string, 10) || PAGINATION.DEFAULT_LIMIT,
    ),
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  query: PaginationQuery,
): PaginatedResponse<T> {
  const meta: PaginationMeta = {
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.ceil(total / query.limit),
  };
  return { data, meta };
}
