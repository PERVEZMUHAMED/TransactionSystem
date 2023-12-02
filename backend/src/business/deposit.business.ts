import { inject, injectable } from "inversify";
import IDepositRepository from "../repository/Interface/deposit.repository.interface";
import { TYPES } from "../di/Types";
import depositModel from "../model/deposit.model";
import { ApolloError } from "apollo-server-express";
import auditorModel from "../model/auditor.model";
import walletModel from "../model/wallet.model";
import currencyModel from "../model/currency.model";
import IDepositBusiness from "./Interface/deposit.business.interface";

@injectable() 
export default  class DepositBusiness implements IDepositBusiness {
    private readonly deposit : IDepositRepository;
    constructor(
        @inject(TYPES.Deposit) private _deposit:IDepositRepository
    ) {
       this.deposit = _deposit; 
    }
    public createDeposit = async(args)=>{
        const {user_id, currency,  Amount, transactionId} = args.input;
        if(!user_id || !currency ||!Amount || !transactionId) {
            throw new ApolloError("401", "Please filled all the fields");
        };
        try {
            const existsTransactionId = await this.deposit.findOne({transactionId:transactionId}, depositModel);
            if(existsTransactionId) throw new ApolloError("401", "TransactionId must be Unique");
            const currencyId = await this.deposit.findOne({code:currency}, currencyModel);
            const prewallet = await this.deposit.wallet(args.input, walletModel);
            console.log("prewalletB", prewallet);
            const deposit = await this.deposit.create({
            user_id:user_id,
            currency_id: currencyId._id,
            transactionId:transactionId,
            currency:currency,
            Amount:Amount
            }, depositModel);
            console.log("depositB", deposit);
            if(!deposit) return new ApolloError("401", "Deposit not created");
            const walletUpdate =await this.deposit.walletUpdate(args.input,walletModel);            
            const postwallet = await this.deposit.wallet(args.input, walletModel);
            const auditor = await this.deposit.create({
                user_id:user_id,
                currency_id:currencyId,
                transactionId:transactionId,
                pre_balance: prewallet.Wallet[0].Amount,
                post_balance:prewallet.Wallet[0].Amount + deposit.Amount,
                category:"Deposit"
            }, auditorModel);
            console.log("auditorB", auditor);
            if(!auditor) return new ApolloError("401", "Auditor not created");
            return deposit;
        } catch (error) {
            return error;
        }
    }
};