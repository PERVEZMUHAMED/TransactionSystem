"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Types_1 = require("../di/Types");
const deposit_model_1 = __importDefault(require("../model/deposit.model"));
const apollo_server_express_1 = require("apollo-server-express");
const auditor_model_1 = __importDefault(require("../model/auditor.model"));
const wallet_model_1 = __importDefault(require("../model/wallet.model"));
const currency_model_1 = __importDefault(require("../model/currency.model"));
let DepositBusiness = class DepositBusiness {
    constructor(_deposit) {
        this._deposit = _deposit;
        this.createDeposit = (args) => __awaiter(this, void 0, void 0, function* () {
            const { user_id, currency, Amount, transactionId } = args.input;
            if (!user_id || !currency || !Amount || !transactionId) {
                throw new apollo_server_express_1.ApolloError("401", "Please filled all the fields");
            }
            ;
            try {
                const existsTransactionId = yield this.deposit.findOne({ transactionId: transactionId }, deposit_model_1.default);
                if (existsTransactionId)
                    throw new apollo_server_express_1.ApolloError("401", "TransactionId must be Unique");
                const currencyId = yield this.deposit.findOne({ code: currency }, currency_model_1.default);
                const prewallet = yield this.deposit.wallet(args.input, wallet_model_1.default);
                console.log("prewalletB", prewallet);
                const deposit = yield this.deposit.create({
                    user_id: user_id,
                    currency_id: currencyId._id,
                    transactionId: transactionId,
                    currency: currency,
                    Amount: Amount
                }, deposit_model_1.default);
                console.log("depositB", deposit);
                if (!deposit)
                    return new apollo_server_express_1.ApolloError("401", "Deposit not created");
                const walletUpdate = yield this.deposit.walletUpdate(args.input, wallet_model_1.default);
                const postwallet = yield this.deposit.wallet(args.input, wallet_model_1.default);
                const auditor = yield this.deposit.create({
                    user_id: user_id,
                    currency_id: currencyId,
                    transactionId: transactionId,
                    pre_balance: prewallet.Wallet[0].Amount,
                    post_balance: prewallet.Wallet[0].Amount + deposit.Amount,
                    category: "Deposit"
                }, auditor_model_1.default);
                console.log("auditorB", auditor);
                if (!auditor)
                    return new apollo_server_express_1.ApolloError("401", "Auditor not created");
                return deposit;
            }
            catch (error) {
                return error;
            }
        });
        this.deposit = _deposit;
    }
};
DepositBusiness = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.TYPES.Deposit)),
    __metadata("design:paramtypes", [Object])
], DepositBusiness);
exports.default = DepositBusiness;
;
