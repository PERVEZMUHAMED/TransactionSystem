"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const objectId = mongoose_1.Types.ObjectId;
const walletSchema = new mongoose_1.Schema({
    user_id: {
        type: objectId,
        required: true
    },
    Wallet: [
        {
            currency_id: {
                type: objectId,
                required: true
            },
            currency: {
                type: String,
                required: [true, "Please Enter currency"]
            },
            Amount: {
                type: Number,
                default: 0
            }
        }
    ]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("wallets", walletSchema);
