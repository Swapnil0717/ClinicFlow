"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./src/config/db"));
async function main() {
    const clinic = await db_1.default.clinic.create({
        data: {
            name: "Default Clinic",
            address: "Main",
        },
    });
    await db_1.default.user.updateMany({
        data: { clinicId: clinic.id },
    });
    await db_1.default.doctor.updateMany({
        data: { clinicId: clinic.id },
    });
    console.log("Done");
}
main();
