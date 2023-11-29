import { Schema, Types, model } from "mongoose";
import Auditor from "./Interface/auditor.model.interface";
const objectId = Types.ObjectId;

const auditorSchema = new Schema({
    user_id:{
        type:objectId,
        required:true
    },
    currency_id:{
        type:objectId,
        required:true
    },
    transactionId:{
        type:String,
        required:[true, "Please Enter password"],
        unique:true
    },
    pre_balance:{
        type:Number,
        default:0
    },
    post_balance:{
        type:Number,
        default:0,
    },
    category:{
        type:String,
        required:[true, "please, enter category"]
    }
},{timestamps:true});

export default model<Auditor>("auditors", auditorSchema);