import { Document } from "mongoose";

export default interface Currency extends Document {
    currencyName:string,
    code:string
}