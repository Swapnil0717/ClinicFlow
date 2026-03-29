export interface DoctorDashboardInput {
    doctorId: string;
    clinicId: string;
  }
  
  export interface PatientDashboardInput {
    userId: string;
    clinicId?: string;
  }
  
  export interface ClinicDashboardInput {
    clinicId: string;
  }