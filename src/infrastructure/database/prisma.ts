import { PrismaClient } from '@prisma/client';

// Singleton para evitar múltiples instancias de Prisma en Lambda
class PrismaConnection {
  private static instance: PrismaClient;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaConnection.instance) {
      PrismaConnection.instance = new PrismaClient({
        log: ['error'], // Solo logs de errores en producción
      });
    }
    return PrismaConnection.instance;
  }
}

export const prisma = PrismaConnection.getInstance();