import { ApolloError } from "apollo-server-errors";
import { user } from "../../di/container.di";
// import  users from "../../di/container.di";
// import { users } from "../../di/container.di"

export const userMutation = {
    Mutation:{
        createUser:async(_: any, args:any, context)=>{
            try {
                const use = await user.Register(args);
                if(!use) throw new ApolloError("401", "User is not created");
                return use;
            } catch (error) {
                return error;
            }
        },
        Login:async(_: any, args: any)=>{
            try {
                const userToken = await user.Login(args);
                if(!userToken) return new ApolloError("401", "usernot login");
                return userToken;
            } catch (error) {
                return error;
            }
        }

    }
};
