// Interface para el contrato del logger (SOLID: Dependency Inversion)
export interface ILogger {
  info(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
  warn(message: string, metadata?: Record<string, unknown>): void;
}

// Implementación concreta para AWS Lambda (usa console.log nativo)
export class LambdaLogger implements ILogger {
  constructor(private context?: Record<string, unknown>) {}

  info(message: string, metadata: Record<string, unknown> = {}): void {
    this.log("INFO", message, metadata);
  }

  error(message: string, metadata: Record<string, unknown> = {}): void {
    this.log("ERROR", message, metadata);
  }

  warn(message: string, metadata: Record<string, unknown> = {}): void {
    this.log("WARN", message, metadata);
  }

  private log(level: string, message: string, metadata: Record<string, unknown>): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      ...metadata,
    };
    console.log(JSON.stringify(logEntry)); // Lambda capturará esto en CloudWatch
  }
}

// Factory opcional para crear instancias
export class LoggerFactory {
  static createLogger(context?: Record<string, unknown>): ILogger {
    return new LambdaLogger(context);
  }
}