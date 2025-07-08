import { SQSEvent, Context } from "aws-lambda";
import { LoggerFactory, ILogger } from "./utils/logger";
import { AppointmentProcessorService } from "./application/services/AppointmentProcessorService";
import { MySqlAppointmentRepository } from "./infrastructure/repositories/MySqlAppointmentRepository";

// Instancia única del repositorio (fuera del handler)
const repository = new MySqlAppointmentRepository();
const processor = new AppointmentProcessorService(repository);

export const handler = async (event: SQSEvent): Promise<void> => {
  const logger: ILogger = LoggerFactory.createLogger({
    lambdaFunction: "AppointmentPeFunction",
  });

  try {
    logger.info("Iniciando procesamiento de mensajes", { count: event.Records.length });
    
    for (const record of event.Records) {
     
      const appointment = JSON.parse(record.body);
      logger.info("Procesando mensaje", { messageId: record.messageId, appointment });
      
      await processor.process(appointment);
      
      logger.info("Mensaje procesado exitosamente", { messageId: record.messageId });
    }

  } catch (error) {
    logger.error("Error crítico", { 
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};