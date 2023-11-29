import { ApolloError } from "apollo-server-express";
import { injectable } from "inversify";
import IDepositRepository from "./Interface/deposit.repository.interface";

@injectable()
export default class DepositRepository implements IDepositRepository {

    public create=async(args, model)=>{
        try {
            const create = await model.create(args);
            if(!create) throw new ApolloError("401", "Data not Created");
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
        }
    }
    public wallet = async(args, model)=>{
        try {
            const wallet = await model.findOne({user_id:args.user_id},
                {_id:0, Wallet:{$elemMatch:{currency:args.currency}}});
                return wallet;
        } catch (error) {
            return error;
        }
    }
    public walletUpdate = async(args, model)=>{
        try {  
            const wallet = await model.updateOne({user_id:args.user_id,
                Wallet:{$elemMatch:{currency:args.currency}}},
                {$inc:{"Wallet.$.Amount":args.Amount}});
                return wallet;
        } catch (error) {
            return error;
        }
    }
}