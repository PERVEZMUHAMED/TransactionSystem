import { injectable } from "inversify";
import { ApolloError } from "apollo-server-express";
import ICurrencyRepository from "./Interface/currency.repository.interface";

@injectable()
export default class CurrencyRepository implements ICurrencyRepository {
    
    public create =async (args, model)=>{
        console.log("argsR", args);
        try {
            const create = await model.create(args);
            if(!create) throw new ApolloError("401", "Currency Not Created");
            return create;
        } catch (error) {
            return error;
        }
    };
    public findOne = async(args, model)=>{
        try {
            const findOne = await model.findOne(args);
            return findOne;
        } catch (error) {
            return error;
        };
    };
    public updateWallet = async(args, model)=>{
        try {
            const wallet = await model.updateMany({"Wallet.currency":
            {$ne: args.code}},
                {$push:{Wallet:{currency_id:args._id,currency:args.code}}
            });
            console.log("wallet", wallet);
            return wallet;
        } catch (error) {
            return error;
        }
    }
};