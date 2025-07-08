// import { SQSEvent } from "aws-lambda";
// import { LoggerFactory, ILogger } from "../../utils/logger";

// export const handler = async (event: SQSEvent): Promise<void> => {
//   const logger: ILogger = LoggerFactory.createLogger({
//     lambdaFunction: process.env.AWS_LAMBDA_FUNCTION_NAME,
//   });

//   try {
//     logger.info("Iniciando procesamiento de mensajes", { count: event.Records.length });
    
//     for (const record of event.Records) {
//       logger.info("Procesando mensaje", { messageId: record.messageId });
//       // ... lógica de negocio
//     }

//   } catch (error) {
//     logger.error("Error crítico", { 
//       error: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : undefined,
//     });
//     throw error;
//   }
// };