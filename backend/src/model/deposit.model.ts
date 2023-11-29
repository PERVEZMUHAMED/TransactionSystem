import {Schema, Types,model} from "mongoose";
import Deposit from "./Interface/deposit.model.interface";
const objectId = Types.ObjectId;

const depositSchema = new Schema({
    user_id:{
        type:objectId,
        required:true
    },
    currency_id:{
        type:objectId,
        required:true,
    },
    transactionId:{
        type:String,
        required:[true, "Please Enter transactionId"],
    },
    currency:{
        type:String,
        required:[true, "please, enter currency"]
    },
    Amount:{
        type:Number,
        default:0
    },
},{timestamps:true});

export default model<Deposit>("deposits", depositSchema);