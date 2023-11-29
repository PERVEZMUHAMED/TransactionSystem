import { Schema, model } from "mongoose";
import Currency from "./Interface/currency.model.interface";

const currencySchema = new Schema({
    currencyName:{
        type:String,
        required:[true,"please enter currencyName"]
    },
    code:{
        type:String,
        required:[true, "please enter currency code"]
    },
}, {timestamps:true});

export default model<Currency>("currencys", currencySchema);