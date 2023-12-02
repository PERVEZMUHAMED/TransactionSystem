import { inject, injectable } from "inversify";
import { TYPES } from "../di/Types";
import ICurrencyRepository from "../repository/Interface/currency.repository.interface";
import ICurrencyBusiness from "./Interface/currency.business.interface";
import { ApolloError } from "apollo-server-express";
import currencyModel from "../model/currency.model";
import walletModel from "../model/wallet.model";


@injectable()
export default class CurrencyBusiness implements ICurrencyBusiness {

    private readonly currency:ICurrencyRepository;
    constructor(
        @inject(TYPES.Currency) private _currency: ICurrencyRepository
    ) {
        this.currency = _currency;
    }
    public createCurrency =async(args: any) =>{
        console.log("argsB", args);
        const {currencyName, code} = args.input;
        if(!currencyName || !code) {
            throw new ApolloError("Please, filled all the fields");
        }
        try {
            const Existcurrency = await this.currency.findOne({currencyName:currencyName}, currencyModel);
            if(Existcurrency) throw new ApolloError("401", "Currency Already Exists");
            const Existcode = await this.currency.findOne({code:code}, currencyModel);
            if(Existcode) throw new ApolloError("401", "Code Already Exists");
            const currency = await this.currency.create({...args.input}, currencyModel);
            const walletUpdate = await this.currency.updateWallet(currency, walletModel);
            console.log("walletUpdateB", walletUpdate);
            return currency;
        } catch (error) {
            return error;
        }
    }
};