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
const apollo_server_express_1 = require("apollo-server-express");
const currency_model_1 = __importDefault(require("../model/currency.model"));
const wallet_model_1 = __importDefault(require("../model/wallet.model"));
let CurrencyBusiness = class CurrencyBusiness {
    constructor(_currency) {
        this._currency = _currency;
        this.createCurrency = (args) => __awaiter(this, void 0, void 0, function* () {
            console.log("argsB", args);
            const { currencyName, code } = args.input;
            if (!currencyName || !code) {
                throw new apollo_server_express_1.ApolloError("Please, filled all the fields");
            }
            try {
                const Existcurrency = yield this.currency.findOne({ currencyName: currencyName }, currency_model_1.default);
                if (Existcurrency)
                    throw new apollo_server_express_1.ApolloError("401", "Currency Already Exists");
                const Existcode = yield this.currency.findOne({ code: code }, currency_model_1.default);
                if (Existcode)
                    throw new apollo_server_express_1.ApolloError("401", "Code Already Exists");
                const currency = yield this.currency.create(Object.assign({}, args.input), currency_model_1.default);
                const walletUpdate = yield this.currency.updateWallet(currency, wallet_model_1.default);
                console.log("walletUpdateB", walletUpdate);
                return currency;
            }
            catch (error) {
                return error;
            }
        });
        this.currency = _currency;
    }
};
CurrencyBusiness = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.TYPES.Currency)),
    __metadata("design:paramtypes", [Object])
], CurrencyBusiness);
exports.default = CurrencyBusiness;
;
