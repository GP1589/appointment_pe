export enum AppointmentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
}

export interface Appointment {
  insuredId: string;
  scheduled: number;
  status: AppointmentStatus;
  countryISO: string;
  scheduleData: {
    centerId: number;
    specialtyId: number;
    medicId: number;
    date: string; // ISO8601
  };
}