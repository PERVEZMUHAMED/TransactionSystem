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
exports.currencyMutation = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const container_di_1 = require("../../di/container.di");
exports.currencyMutation = {
    Mutation: {
        createCurrency: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const c = yield container_di_1.currency.createCurrency(args);
                if (!c)
                    throw new apollo_server_errors_1.ApolloError("401", "User is not created");
                return c;
            }
            catch (error) {
                return error;
            }
        })
    }
};
