type BaseUser = {
  userId: string;
  role: "ADMIN" | "DOCTOR" | "PATIENT";
};

type DoctorUser = BaseUser & {
  role: "DOCTOR";
  doctorId: string;
};

type PatientUser = BaseUser & {
  role: "PATIENT";
};

type AdminUser = BaseUser & {
  role: "ADMIN";
};

export type AuthUser = DoctorUser | PatientUser | AdminUser;

export interface AuthRequest extends Request {
  user?: AuthUser;
}