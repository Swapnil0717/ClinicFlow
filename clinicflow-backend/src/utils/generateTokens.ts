import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const generateTokens = (payload: {
  userId: string;
  role: string;
}) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};