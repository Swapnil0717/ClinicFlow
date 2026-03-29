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
exports.googleLogin = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.login = exports.register = void 0;
const authService = __importStar(require("./auth.service"));
const asyncHandler_1 = require("../../utils/asyncHandler");
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const tokens = await authService.loginUser(req.body);
    res.status(200).json(tokens);
});
exports.verifyEmail = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService.verifyEmail(req.query.token);
    res.status(200).json(result);
});
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);
    res.status(200).json(result);
});
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
});
exports.googleLogin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const tokens = await authService.googleLogin(req.body.idToken);
    res.status(200).json(tokens);
});
