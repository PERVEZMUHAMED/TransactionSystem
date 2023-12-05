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
exports.userMutation = void 0;
const apollo_server_errors_1 = require("apollo-server-errors");
const container_di_1 = require("../../di/container.di");
exports.userMutation = {
    Mutation: {
        createUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const use = yield container_di_1.user.Register(args);
                if (!use)
                    throw new apollo_server_errors_1.ApolloError("401", "User is not created");
                return use;
            }
            catch (error) {
                return error;
            }
        }),
        Login: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const token = yield container_di_1.user.Login(args);
                console.log("userTokenB", token);
                if (!token)
                    return new apollo_server_errors_1.ApolloError("401", "usernot login");
                return token;
            }
            catch (error) {
                return error;
            }
        }),
        forgotPassword: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const fp = yield container_di_1.user.forgotPassword(args);
                if (!fp)
                    throw new apollo_server_errors_1.ApolloError("Forgot password is not found ", "401");
                return fp;
            }
            catch (error) {
                return error;
            }
        }),
        resetPassword: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const rp = yield container_di_1.user.resetPassword(args);
                if (!rp)
                    throw new apollo_server_errors_1.ApolloError("Password not reset", "401");
                return rp;
            }
            catch (error) {
                return error;
            }
        }),
        changePassword: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const chPW = yield container_di_1.user.changePassword(args, context);
                if (!chPW)
                    throw new apollo_server_errors_1.ApolloError("Password not change", "401");
                return chPW;
            }
            catch (error) {
                return error;
            }
        })
    }
};
