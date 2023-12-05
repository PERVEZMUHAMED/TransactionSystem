"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const currencySchema = new mongoose_1.Schema({
    currencyName: {
        type: String,
        required: [true, "please enter currencyName"]
    },
    code: {
        type: String,
        required: [true, "please enter currency code"]
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("currencys", currencySchema);
