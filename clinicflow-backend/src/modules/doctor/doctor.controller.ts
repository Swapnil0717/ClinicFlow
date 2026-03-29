import { Response } from "express";
import * as doctorService from "./doctor.service";
import { AuthRequest } from "../../types/express";

export const createDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const result = await doctorService.createDoctor(req, req.body);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const result = await doctorService.verifyDoctor(req.params.id);

    res.json({
      success: true,
      message: "Doctor verified & auto-login enabled",
      data: result,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingDoctors = async (_req: AuthRequest, res: Response) => {
  const doctors = await doctorService.getPendingDoctors();

  res.json({
    success: true,
    data: doctors,
  });
};

export const getAllDoctors = async (req: AuthRequest, res: Response) => {
  try {
    const doctors = await doctorService.getAllDoctors(req);

    res.json({
      success: true,
      data: doctors,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDoctorById = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await doctorService.getDoctorById(req, req.params.id);

    res.json({
      success: true,
      data: doctor,
    });

  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

//////////////////////////////
// REJECT DOCTOR
//////////////////////////////

export const rejectDoctor = async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;

    const doctor = await doctorService.rejectDoctor(
      req.params.id,
      reason
    );

    res.json({
      success: true,
      message: "Doctor rejected",
      data: doctor,
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};