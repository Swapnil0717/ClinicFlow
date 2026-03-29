import jwt from "jsonwebtoken";

export const generateTokens = (payload: {
  userId: string;
  role: string;
  clinicId?: string | null;
}) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "15m", // 🔥 short-lived
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};