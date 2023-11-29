import { Document } from "mongoose";

export default interface User extends Document {
    userName:string,
    email:string,
    password:string,
    personalDetails:{
        gender:string,
        age:number
    }
};