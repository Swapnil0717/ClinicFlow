import { Request, Response } from "express";
import * as doctorService from "./doctor.service";
import { AuthRequest } from "../../types/express";

// Create Doctor (ADMIN)
export const createDoctor = async (req: Request, res: Response) => {
  try {
    const result = await doctorService.createDoctor(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all doctors (Public)
export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    res.status(200).json(doctors);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get doctor by ID
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.getDoctorById(id);
    res.status(200).json(doctor);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

// Update own profile (DOCTOR)
export const updateMyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    const updated = await doctorService.updateMyDoctorProfile(
      userId as string,
      req.body
    );

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const completeProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const result = await doctorService.createDoctorProfile(
      userId as string,
      req.body
    );

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};