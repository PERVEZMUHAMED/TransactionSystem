import { ApolloError } from "apollo-server-express";
import { getuser, user } from "../../di/container.di"


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
        },
        getSpecificUserAllDetails:async(parent, args, context)=>{
            try {
                const Getspecificuseralldetails = await getuser.getSpecificUserAllDetails(args, context);
                if(!Getspecificuseralldetails) throw new ApolloError("User Not Found", "401");
                console.log("getuser", Getspecificuseralldetails);
                return Getspecificuseralldetails;
            } catch (error) {
                return error;
            }
        }
    }
}