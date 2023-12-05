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
exports.userQuery = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const container_di_1 = require("../../di/container.di");
exports.userQuery = {
    Query: {
        getUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            // console.log("argsQ", args);
            try {
                const getuser = yield container_di_1.user.GetUser(args, context);
                console.log("getuserQ", getuser);
                if (!getuser)
                    throw new apollo_server_express_1.ApolloError("User not Found", "401");
                return getuser;
            }
            catch (error) {
                return error;
            }
        }),
        getSpecificUserAllDetails: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const Getspecificuseralldetails = yield container_di_1.getuser.getSpecificUserAllDetails(args, context);
                if (!Getspecificuseralldetails)
                    throw new apollo_server_express_1.ApolloError("User Not Found", "401");
                console.log("getuser", Getspecificuseralldetails);
                return Getspecificuseralldetails;
            }
            catch (error) {
                return error;
            }
        })
    }
};
