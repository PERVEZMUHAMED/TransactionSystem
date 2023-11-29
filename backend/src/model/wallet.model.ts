import { Schema, Types, model } from "mongoose";
import Wallet from "./Interface/wallet.model.interface";
const objectId = Types.ObjectId;

const walletSchema = new Schema({
    user_id:{
        type:objectId,
        required:true
    },
    Wallet:[
        {
            currency_id:{
                type:objectId,
                required:true
            },
            currency:{
                type:String,
                required:[true, "Please Enter currency"]
            },
            Amount:{
                type:Number,
                default:0
            }
        }
    ]
},{timestamps:true});

export default model<Wallet>("wallets", walletSchema);
