import { IAppointmentRepository } from '../../domain/ports/IAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';
import { prisma } from '../database/prisma'; // Conexión aislada

export class MySqlAppointmentRepository implements IAppointmentRepository {
  async save(appointment: Appointment): Promise<void> {
    await prisma.appointmentPE.create({
      data: {
        insured_id: appointment.insuredId,
        schedule_id: appointment.scheduleId,
        center_id: appointment.scheduleData.centerId,
        specialty_id: appointment.scheduleData.specialtyId,
        medic_id: appointment.scheduleData.medicId,
        appointment_date: new Date(appointment.scheduleData.date),
      },
    });
  }
}