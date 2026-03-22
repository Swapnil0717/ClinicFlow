import { Request, Response } from "express";
import * as authService from "./auth.service";

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const tokens = await authService.loginUser(req.body);
    res.status(200).json(tokens);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const result = await authService.verifyEmail(token as string);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Forgot Password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword({ token, newPassword });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    const tokens = await authService.googleLogin(idToken);

    res.status(200).json(tokens);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};