import { ApolloError } from "apollo-server-errors";
import { currency } from "../../di/container.di"

export const currencyMutation = {
    Mutation:{
        createCurrency:async(_, args)=>{
            try {
                const c = await currency.createCurrency(args);
                if(!c) throw new ApolloError("401", "User is not created");
                return c;
            } catch (error) {
                return error;
            }
        }
    }
};