import { ApolloError } from "apollo-server-errors";
import { withdraw } from "../../di/container.di"

export const withdrawMutation = {
    Mutation:{
        createWithdraw:async(_, args)=>{
            try {
                const createWithdraw = await withdraw.createWithdraw(args);
                if(!createWithdraw) throw new ApolloError("401", "Deposit is not created");
                return createWithdraw;
            } catch (error) {
                return error;
            }
        }
    }
};