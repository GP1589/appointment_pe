import { IAppointmentRepository } from "../../domain/ports/IAppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";
import { EventBridge } from "aws-sdk";

const eventBridge = new EventBridge();

export class AppointmentProcessorService {
  constructor(private repository: IAppointmentRepository) {}

  async process(appointment: Appointment): Promise<void> {
    // Validaciones adicionales aquí (opcional)
    if (!["PE", "CL"].includes(appointment.countryISO)) {
      throw new Error("País no soportado");
    }
    await this.repository.save(appointment);

    const result = await eventBridge
      .putEvents({
        Entries: [
          {
            Source: "appointment.system",
            DetailType: "Appointment Processed",
            Detail: JSON.stringify(appointment),
            EventBusName: process.env.EVENT_BUS_NAME || "default",
          },
        ],
      })
      .promise();

    if (result.FailedEntryCount && result.FailedEntryCount > 0) {
      console.error("Failed to publish event:", result.Entries);
      // puedes lanzar un error o reportarlo a un sistema de monitoreo
    }
  }
}
