import {Schema, Types,model} from "mongoose";
import Withdraw from "./Interface/withdraw.model.interface";
const objectId = Types.ObjectId;

const withdrawSchema = new Schema({
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

export default model<Withdraw>("withdraws", withdrawSchema);