"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeProfile = exports.updateMyProfile = exports.getDoctorById = exports.getAllDoctors = exports.createDoctor = void 0;
const doctorService = __importStar(require("./doctor.service"));
// Create Doctor (ADMIN)
const createDoctor = async (req, res) => {
    try {
        const result = await doctorService.createDoctor(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createDoctor = createDoctor;
// Get all doctors (Public)
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorService.getAllDoctors();
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllDoctors = getAllDoctors;
// Get doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await doctorService.getDoctorById(id);
        res.status(200).json(doctor);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getDoctorById = getDoctorById;
// Update own profile (DOCTOR)
const updateMyProfile = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const updated = await doctorService.updateMyDoctorProfile(userId, req.body);
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateMyProfile = updateMyProfile;
const completeProfile = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const result = await doctorService.createDoctorProfile(userId, req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.completeProfile = completeProfile;
