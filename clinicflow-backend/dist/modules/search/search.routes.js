"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const search_controller_1 = require("./search.controller");
const router = (0, express_1.Router)();
// Public search
router.get("/doctors", search_controller_1.SearchController.searchDoctors);
exports.default = router;
