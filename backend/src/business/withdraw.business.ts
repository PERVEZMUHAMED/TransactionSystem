import { inject, injectable } from "inversify";
import { ApolloError } from "apollo-server-express";
import { Types } from "../di/Types";
import IWithdrawRepository from "../repository/Interface/withdraw.repository.interface";
import IWithdrawBusiness from "./Interface/withdraw.business.interface";
import withdrawModel from "../model/withdraw.model";
import auditorModel from "../model/auditor.model";
import walletModel from "../model/wallet.model";
import currencyModel from "../model/currency.model";

@injectable() 
export default  class WithdrawBusiness implements IWithdrawBusiness {
    private readonly withdraw : IWithdrawRepository;
    constructor(
        @inject(Types.Withdraw) private _withdraw:IWithdrawRepository
    ) {
       this.withdraw = _withdraw; 
    }
    public createWithdraw = async(args)=>{
        const {user_id, currency,  Amount, transactionId} = args.input;
        if(!user_id || !currency ||!Amount || !transactionId) {
            throw new ApolloError("401", "Please filled all the fields");
        };
        try {
            const existsTransactionId = await this.withdraw.findOne({transactionId:transactionId}, withdrawModel);
            if(existsTransactionId) throw new ApolloError("401", "TransactionId must be Unique");
            const currencyId = await this.withdraw.findOne({code:currency}, currencyModel);
            const prewallet = await this.withdraw.wallet(args.input, walletModel);
            console.log("prewalletB", prewallet);
            const withdraw = await this.withdraw.create({
            user_id:user_id,
            currency_id: currencyId._id,
            transactionId:transactionId,
            currency:currency,
            Amount:Amount
            }, withdrawModel);
            console.log("depositB", withdraw);
            if(!withdraw) return new ApolloError("401", "Withdraw not created");
            const walletUpdate =await this.withdraw.walletUpdate(args.input,walletModel);            
            const postwallet = await this.withdraw.wallet(args.input, walletModel);
            const auditor = await this.withdraw.create({
                user_id:user_id,
                currency_id:currencyId,
                transactionId:transactionId,
                pre_balance: prewallet.Wallet[0].Amount,
                post_balance:prewallet.Wallet[0].Amount - withdraw.Amount,
                category:"Withdraw"
            }, auditorModel);
            console.log("auditorB", auditor);
            if(!auditor) return new ApolloError("401", "Auditor not created");
            return withdraw;
        } catch (error) {
            return error;
        }
    }
};