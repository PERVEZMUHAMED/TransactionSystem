"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const objectId = mongoose_1.Types.ObjectId;
const auditorSchema = new mongoose_1.Schema({
    user_id: {
        type: objectId,
        required: true
    },
    currency_id: {
        type: objectId,
        required: true
    },
    transactionId: {
        type: String,
        required: [true, "Please Enter password"],
        unique: true
    },
    pre_balance: {
        type: Number,
        default: 0
    },
    post_balance: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: [true, "please, enter category"]
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("auditors", auditorSchema);
