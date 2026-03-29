"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const search_service_1 = require("./search.service");
class SearchController {
    static async searchDoctors(req, res) {
        try {
            const { specialization, date } = req.query;
            const doctors = await search_service_1.SearchService.searchDoctors({
                specialization: specialization,
                date: date,
            });
            return res.status(200).json({
                message: "Doctors fetched successfully",
                data: doctors,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}
exports.SearchController = SearchController;
