export enum AppointmentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export interface Appointment {
  insuredId: string;
  scheduleId: number;
  status: AppointmentStatus;
  countryISO: string;
  scheduleData: {
    centerId: number;
    specialtyId: number;
    medicId: number;
    date: string; // ISO8601
  };
}