import { ApolloError } from "apollo-server-errors";
import { deposit } from "../../di/container.di"

export const depositMutation = {
    Mutation:{
        createDeposit:async(_, args)=>{
            try {
                const createDeposit = await deposit.createDeposit(args);
                if(!createDeposit) throw new ApolloError("401", "Deposit is not created");
                return createDeposit;
            } catch (error) {
                return error;
            }
        }
    }
};