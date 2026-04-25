import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users, userSessions } from "../../db/schema";
import { ApiError } from "../../utils/apiError";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../../utils/jwt";
import { verifyHash, hashData } from "../../utils/password";
import { LoginInput, RegisterInput } from "./auth.validator";

interface SessionMeta {
  ipAddress?: string;
  userAgent?: string;
}

class AuthService {
  async register(input: RegisterInput) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (existingUser) {
      throw ApiError.conflict("User with this email already exists");
    }

    const hashedPassword = await hashData(input.password);

    const newUser = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    return newUser;
  }

  async login(input: LoginInput, meta: SessionMeta) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email),
    });

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const valid = await verifyHash(input.password, user.hashedPassword);
    if (!valid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const tokenPayload = { userId: user.id, role: user.role };

    const [session] = await db
      .insert(userSessions)
      .values({
        userId: user.id,
        refreshToken: "",
        ipAddress: meta.ipAddress || null,
        userAgent: meta.userAgent || null,
      })
      .returning({ id: userSessions.id });

    const accessToken = signAccessToken({
      ...tokenPayload,
      sessionId: session.id,
    });
    const refreshToken = signRefreshToken({
      ...tokenPayload,
      sessionId: session.id,
    });

    const hashedRefresh = await hashData(refreshToken);
    await db
      .update(userSessions)
      .set({ refreshToken: hashedRefresh })
      .where(eq(userSessions.id, session.id));

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string, meta: SessionMeta) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    if (!payload.sessionId) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    const session = await db.query.userSessions.findFirst({
      where: eq(userSessions.id, payload.sessionId),
    });

    if (!session) {
      throw ApiError.unauthorized("Session not found");
    }

    const valid = await verifyHash(refreshToken, session.refreshToken);

    if (!valid) {
      await db.delete(userSessions).where(eq(userSessions.id, session.id));
      throw ApiError.unauthorized("Refresh token reuse detected");
    }

    const newTokenPayload = {
      userId: payload.userId,
      role: payload.role,
      sessionId: session.id,
    };
    const newAccessToken = signAccessToken(newTokenPayload);
    const newRefreshToken = signRefreshToken(newTokenPayload);

    const hashedRefresh = await hashData(newRefreshToken);
    await db
      .update(userSessions)
      .set({
        refreshToken: hashedRefresh,
        ipAddress: meta.ipAddress || session.ipAddress,
        userAgent: meta.userAgent || session.userAgent,
      })
      .where(eq(userSessions.id, session.id));

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(sessionId: number) {
    await db.delete(userSessions).where(eq(userSessions.id, sessionId));
  }

  async logoutAll(userId: string) {
    await db.delete(userSessions).where(eq(userSessions.userId, userId));
  }
}

export const authService = new AuthService();
