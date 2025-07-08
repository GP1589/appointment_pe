import { IAppointmentRepository } from "../../domain/ports/IAppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";

export class AppointmentProcessorService {
  constructor(private repository: IAppointmentRepository) {}

  async process(appointment: Appointment): Promise<void> {
    // Validaciones adicionales aquí (opcional)
    if (!["PE", "CL"].includes(appointment.countryISO)) {
      throw new Error("País no soportado");
    }
    await this.repository.save(appointment);
  }
}