import { IAppointmentRepository } from "../../domain/ports/IAppointmentRepository";
import { Appointment } from "../../domain/entities/Appointment";
import { EventBridge } from "aws-sdk";

const eventBridge = new EventBridge();

export class AppointmentProcessorService {
  constructor(private repository: IAppointmentRepository) {}

  async process(appointment: Appointment): Promise<void> {
    try {
      console.log(
        "Iniciando procesamiento de cita:",
        JSON.stringify(appointment, null, 2)
      );

      // Validaciones
      if (!["PE", "CL"].includes(appointment.countryISO)) {
        const errorMsg = `País no soportado: ${appointment.countryISO}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Guardar en repositorio
      console.log("Guardando cita en el repositorio...");
      await this.repository.save(appointment);
      console.log("Cita guardada exitosamente");

      // Preparar el detalle del evento con status "completed" para que coincida con la regla
      const eventDetail = {
        ...appointment,
        status: "completed", // Asegurando que coincida con el event pattern
      };

      // Configurar evento para EventBridge
      const eventParams = {
        Entries: [
          {
            Source: "appointment.system",
            DetailType: "Appointment Processed",
            Detail: JSON.stringify(eventDetail), // Usamos el detalle modificado
            EventBusName: process.env.EVENT_BUS_NAME || "default",
          },
        ],
      };

      console.log(
        "Publicando evento en EventBridge con parámetros:",
        JSON.stringify(eventParams, null, 2)
      );

      const result = await eventBridge.putEvents(eventParams).promise();
      console.log("Respuesta de EventBridge:", JSON.stringify(result, null, 2));

      if (result.FailedEntryCount && result.FailedEntryCount > 0) {
        const errorMsg = `Error al publicar evento. Fallas: ${result.FailedEntryCount}`;
        console.error(errorMsg, result.Entries);
        throw new Error(errorMsg);
      }

      console.log("Evento publicado exitosamente en EventBridge");
    } catch (error) {
      console.error("Error en AppointmentProcessorService:", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        appointment: JSON.stringify(appointment, null, 2),
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }
}
