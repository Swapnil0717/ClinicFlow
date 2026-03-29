"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClinicSchema = void 0;
const zod_1 = require("zod");
exports.createClinicSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    address: zod_1.z.string().min(5),
});
