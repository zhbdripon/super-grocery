import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";
import { LoginInput, RefreshInput } from "./auth.validator";

class AuthController {
  async register(req: Request, res: Response) {
    const input = req.body;

    const user = await authService.register(input);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: user,
      message: "User registered successfully",
    });
  }

  async login(req: Request, res: Response) {
    const input = req.body as LoginInput;
    const meta = {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    };

    const result = await authService.login(input, meta);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  }

  async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body as RefreshInput;
    const meta = {
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    };

    const tokens = await authService.refresh(refreshToken, meta);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Tokens refreshed",
      data: tokens,
    });
  }

  async logout(req: Request, res: Response) {
    const sessionId = req.user!.sessionId!;
    await authService.logout(sessionId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  }

  async logoutAll(req: Request, res: Response) {
    const userId = req.user!.userId;
    await authService.logoutAll(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "All sessions terminated",
    });
  }
}

export const authController = new AuthController();
