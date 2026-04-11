export interface TokenPayload {
  userId: string;
  role: "admin" | "user";
  sessionId?: number;
}