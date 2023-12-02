import express, {Application}  from "express";
import {ApolloError, ApolloServer} from "apollo-server-express";
import { typeDefs } from "./type/typeDefs";
import dotenv from "dotenv";
import { join } from "path";
import { userMutation } from "./resolver/mutation/userMutation";
import { currencyMutation } from "./resolver/mutation/currencyMutation";
import { depositMutation } from "./resolver/mutation/depositMutation";
import { withdrawMutation } from "./resolver/mutation/withdrawMutation";
dotenv.config({path:join(__dirname, "config/config.env")});
import {user} from "./di/container.di";
import { userQuery } from "./resolver/query/userQuery";

export default class App {
    app:Application;
    constructor(){
        this.app = express();
    };
    public startServer =()=>{
        const {PORT} = process.env;
        const server = new ApolloServer({ 
            typeDefs:typeDefs,
            resolvers:[
                userMutation, currencyMutation,  depositMutation, 
                withdrawMutation, userQuery
            ],
            context:async({req})=>{
                try {
                    const token = req.headers.authorization || " ";
                    // console.log("tokenA", token);
                    // if(!token) throw new ApolloError("Token is Invalid or login first to handle this resource", "401");
                    const users = await user.Verifytoken(token);
                    // console.log("usersA", users);
                    // if(!users) throw new ApolloError("UnAuthorizedUser", "401");
                    return {users};
                } catch (error) {
                    return error;
                }
            }
        });
        const app = server.applyMiddleware({app:this.app});
        this.app.listen(PORT,()=>{
            console.log(`server is connected in http://localhost:${PORT}${server.graphqlPath}`); 
        });
    };
};