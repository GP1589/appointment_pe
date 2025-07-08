import { Appointment } from "../entities/Appointment";

export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<void>;
}