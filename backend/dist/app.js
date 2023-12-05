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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs_1 = require("./type/typeDefs");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = require("path");
const userMutation_1 = require("./resolver/mutation/userMutation");
const currencyMutation_1 = require("./resolver/mutation/currencyMutation");
const depositMutation_1 = require("./resolver/mutation/depositMutation");
const withdrawMutation_1 = require("./resolver/mutation/withdrawMutation");
dotenv_1.default.config({ path: (0, path_1.join)(__dirname, "config/config.env") });
const container_di_1 = require("./di/container.di");
const userQuery_1 = require("./resolver/query/userQuery");
class App {
    constructor() {
        this.startServer = () => {
            const { PORT } = process.env;
            const server = new apollo_server_express_1.ApolloServer({
                typeDefs: typeDefs_1.typeDefs,
                resolvers: [
                    userMutation_1.userMutation, currencyMutation_1.currencyMutation, depositMutation_1.depositMutation,
                    withdrawMutation_1.withdrawMutation, userQuery_1.userQuery,
                ],
                context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const token = req.headers.authorization || " ";
                        // console.log("tokenA", token);
                        // if(!token) throw new ApolloError("Token is Invalid or login first to handle this resource", "401");
                        const users = yield container_di_1.user.Verifytoken(token);
                        // console.log("usersA", users);
                        // if(!users) throw new ApolloError("UnAuthorizedUser", "401");
                        return { users };
                    }
                    catch (error) {
                        return error;
                    }
                })
            });
            const app = server.applyMiddleware({ app: this.app });
            this.app.listen(PORT, () => {
                console.log(`server is connected in http://localhost:${PORT}${server.graphqlPath}`);
            });
        };
        this.app = (0, express_1.default)();
    }
    ;
}
exports.default = App;
;
