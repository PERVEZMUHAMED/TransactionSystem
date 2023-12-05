"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const apollo_server_express_1 = require("apollo-server-express");
let CurrencyRepository = class CurrencyRepository {
    constructor() {
        this.create = (args, model) => __awaiter(this, void 0, void 0, function* () {
            console.log("argsR", args);
            try {
                const create = yield model.create(args);
                if (!create)
                    throw new apollo_server_express_1.ApolloError("401", "Currency Not Created");
                return create;
            }
            catch (error) {
                return error;
            }
        });
        this.findOne = (args, model) => __awaiter(this, void 0, void 0, function* () {
            try {
                const findOne = yield model.findOne(args);
                return findOne;
            }
            catch (error) {
                return error;
            }
            ;
        });
        this.updateWallet = (args, model) => __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield model.updateMany({ "Wallet.currency": { $ne: args.code } }, { $push: { Wallet: { currency_id: args._id, currency: args.code } }
                });
                console.log("wallet", wallet);
                return wallet;
            }
            catch (error) {
                return error;
            }
        });
    }
};
CurrencyRepository = __decorate([
    (0, inversify_1.injectable)()
], CurrencyRepository);
exports.default = CurrencyRepository;
;
