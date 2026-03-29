"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const appointment_service_1 = require("./appointment.service");
const asyncHandler_1 = require("../../utils/asyncHandler");
class AppointmentController {
}
exports.AppointmentController = AppointmentController;
_a = AppointmentController;
AppointmentController.bookAppointment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const appointment = await appointment_service_1.AppointmentService.bookAppointment({
        patientId: req.user.userId,
        subSlotId: req.body.subSlotId,
        clinicId: req.user.clinicId,
    });
    res.status(201).json({
        message: "Appointment booked",
        data: appointment,
    });
});
AppointmentController.cancelAppointment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await appointment_service_1.AppointmentService.cancelAppointment({
        appointmentId: req.params.appointmentId,
        patientId: req.user.userId,
        clinicId: req.user.clinicId,
    });
    res.json({ message: "Cancelled", data: result });
});
AppointmentController.getDoctorAppointments = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await appointment_service_1.AppointmentService.getDoctorAppointments(req.user.doctorId, req.user.clinicId);
    res.json({ data });
});
AppointmentController.getPatientAppointments = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = await appointment_service_1.AppointmentService.getPatientAppointments(req.user.userId, req.user.clinicId);
    res.json({ data });
});
