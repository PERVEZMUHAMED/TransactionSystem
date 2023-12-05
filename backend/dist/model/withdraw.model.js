"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const objectId = mongoose_1.Types.ObjectId;
const withdrawSchema = new mongoose_1.Schema({
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
        required: [true, "Please Enter transactionId"],
    },
    currency: {
        type: String,
        required: [true, "please, enter currency"]
    },
    Amount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("withdraws", withdrawSchema);
