import { ApolloError } from "apollo-server-express";
import { user } from "../../di/container.di"


export const userQuery = {
    Query:{
        getUser: async(parent, args, context)=>{
            // console.log("argsQ", args);
            try {
                const getuser = await user.GetUser(args, context);
                console.log("getuserQ", getuser);
                if(!getuser) throw new ApolloError("User not Found", "401");
                return getuser;
            } catch (error) {
                return error;
            }
        }
    }
}