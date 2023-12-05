"use strict";
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
exports.depositMutation = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const container_di_1 = require("../../di/container.di");
exports.depositMutation = {
    Mutation: {
        createDeposit: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const createDeposit = yield container_di_1.deposit.createDeposit(args);
                if (!createDeposit)
                    throw new apollo_server_errors_1.ApolloError("401", "Deposit is not created");
                return createDeposit;
            }
            catch (error) {
                return error;
            }
        })
    }
};
