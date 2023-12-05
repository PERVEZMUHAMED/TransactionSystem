import {Schema, model} from "mongoose";
import User from "./Interface/user.model.interface";
import validator from "validator";

const userSchema = new Schema({
    userName:{
        type:String,
        required:[true, "please enter userName"],
        trim:true
    },
    email:{
        type:String,
        required:[true, "please, enter email"],
        validate:[validator.isEmail, "please enter valid Email address"],
    },
    password:{
        type:String,
        requried:[true, "Please enter password"],
    },
    personalDetails:{
        gender:{
            type:String
        },
        age:Number
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordTokenExpire:Date,
},{timestamps:true});

export default model<User>("users", userSchema);