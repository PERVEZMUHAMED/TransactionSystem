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
                const token = await user.Login(args);
                console.log("userTokenB", token);
                if(!token) return new ApolloError("401", "usernot login");
                return token;
            } catch (error) {
                return error;
            }
        },
        changePassword: async(parent, args, context)=>{
            try {
                const chPW = await user.changePassword(args, context);
                if(!chPW) throw new ApolloError("Password not change", "401");
                return chPW;
            } catch (error) {
                return error;
            }
        }
    }
};
