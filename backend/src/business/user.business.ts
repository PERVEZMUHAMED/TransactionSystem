import "reflect-metadata";
import {injectable, inject} from "inversify";
import IUserRepository from "../repository/Interface/user.repository.interface";
import { TYPES } from "../di/Types";
import {compare, hash} from "bcrypt";
import {ApolloError} from "apollo-server-errors";
import IUserBusiness from "./Interface/user.business.interface";
import userModel from "../model/user.model";
import currencyModel from "../model/currency.model";
import walletModel from "../model/wallet.model";
import jwt from "jsonwebtoken";
import nodemailer, { createTransport } from "nodemailer";
import { createHash, randomBytes } from "crypto";
import { Types } from "mongoose";
let objectId = Types.ObjectId;
@injectable()
export default class UserBusiness implements IUserBusiness  {
    private readonly user: IUserRepository;
    constructor(
        @inject(TYPES.User) private _user:IUserRepository
    ) {
        this.user = _user;
    };
    public Register = async(args:any)=>{
        const {userName, password, email} = args.input;
        if(!userName || !password || !email) {
            throw new ApolloError("401", "Please filled all the fields");
        };
        try {
            const hashPassword = await hash(password, 7);
            const existUser = await this.user.findOne({userName:userName}, userModel);
            if(existUser) throw new ApolloError("401", "UserName Already Exists");
            const existEmail = await this.user.findOne({email:email}, userModel);
            if(existEmail) throw new ApolloError("401", "email Already Exists");
            const createUser = await this.user.create({...args.input, password:hashPassword}, userModel);
            const currency = await this.user.find(args.input, currencyModel);
            // console.log("currencyB", currency);
            // console.log("currencyBL", currency.length);
            let curr:any =[];
            let objec:any = {};
            for(let i=0; i<currency.length; i++) {
                objec ={};
                objec.currency_id = currency[i]._id;
                objec.currency = currency[i].code;
                curr.push(objec);
            };
            // console.log("curr", curr);
            const wallet = await this.user.create({
                user_id: createUser._id,
                Wallet:curr
            }, walletModel);
            console.log("walletB", wallet);
            return createUser;
        } catch (error) {
            return error;
        }
    };
    public Login = async(args)=>{
        const {email, password} = args.input;
        try {
            const existEmail = await this.user.findOne({email:email}, userModel);
            if(!existEmail) throw new ApolloError("Invalid email or password", "401");
            console.log("existEmailB", existEmail);
            const validPw = await compare(password, existEmail.password);
            if(!validPw) throw new ApolloError("Invalid email or password", "401");
            const {JWT_SECRET, JWT_EXPIRES_TIMES} = process.env;
            const token = jwt.sign({_id:existEmail._id}, JWT_SECRET,
            {expiresIn: JWT_EXPIRES_TIMES});
            return {token};
        } catch (error) {
            return error;           
        }
    }
    public GetUser = async(args, context)=>{
        console.log("contextB", context.users._id);
        console.log("argsB", args);
        console.log("contextB", context);
        console.log(context.users._id == new objectId(args._id));
        if(context.users._id == args._id) {
            try {
                const user = await this.user.findById({_id:new objectId(args._id)}, userModel);
                console.log("user", user);
                if(!user) throw new ApolloError("401", "user not exits");
                return user;
            } catch (error) {
                return error;
            }
        } else {
            throw new ApolloError("you not have access to retrieve this account", "401");
        }
    }
    public Verifytoken = async(args)=>{
        try {
            const {JWT_SECRET} = process.env;
            const decoded:any = await jwt.verify(args, JWT_SECRET);
            if(!decoded) throw new ApolloError("Unauthorized User", "401");
            const user = await this.user.findById(decoded._id, userModel);
            return user;
        } catch (error) {
            return error;
        }
    }
    public  changePassword = async(args, context)=>{
        const {oldPassword, newPassword} = args.input;
        if(context.users) {
            try {
                const user = await this.user.findById({_id:context.users._id}, userModel);
                if(!user) return new ApolloError("User not Found", "401");
                const validOldPW = await compare(oldPassword, user.password);
                if(!validOldPW) throw new ApolloError("YOur old password is wrong","401");
                const hashPassword = await hash(newPassword, 7);
                user.password = hashPassword;
                await user.save();
                return true;
            } catch (error) {
                return error;
            }
        } else {
            throw new ApolloError("First login and then hanlde this resouce", "401");
        }
    }
    public forgotPassword = async(args)=>{
        const {email} = args;
        try {
            const token = randomBytes(20).toString('hex');
            const resetToken = createHash("sha256").update(token).digest('hex');
            const expireToken = Date.now() + 30*60*1000;

            const user = await this.user.findOne({email:email}, userModel);
            if(!user) throw new ApolloError("User not found with the email", "401");
            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpire = expireToken;
            await user.save({validateBeforeSave:false});
            console.log("resetToken");
            
            console.log("resetPasswordTokenB", user.resetPasswordToken);

            // create a reseturl
            const {PORT} = process.env;
            const resetUrl = `http://localhost:${PORT}/reset-password?token=${resetToken}`;
            const message = `Your password reset url is as follows \n\n
            ${resetUrl} \n\n If you have not requested this email, then ignore it.`
            const sendEmail = await this.sendResetPasswordEmail({
                email:user.email,
                subject:"JVLCART Password Recovery",
                message:message
            })
            console.log("sendEmailB", sendEmail);
            return true;
        } catch (error) {
            return error;
        }
    }
    public sendResetPasswordEmail = async(options)=>{

        const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_NAME, SMTP_FROM_EMAIL} = process.env;
        const transport:any = {
            host:SMTP_HOST,
            port:SMTP_PORT,
            auth: {
              user:SMTP_USER,
              pass:SMTP_PASS
            },
        };
        const transporter = createTransport(transport);
        const message = {
            from: `${SMTP_FROM_NAME} <${SMTP_FROM_EMAIL}>`,
            to:options.email,
            subject:options.subject,
            text:options.message
        }
        await transporter.sendMail(message);
    }
    public resetPassword = async(args)=>{
        const {resetPasswordToken, newPassword} = args;
        try {
            const resetPassword = createHash('sha256').update(resetPasswordToken).digest('hex');
            console.log("resetPasswordTokenB", resetPassword);
            const user = await this.user.findOne({
                resetPasswordToken,
                resetPasswordTokenExpire:{$gt:Date.now()}
            },userModel);
            if(!user) throw new ApolloError("Password reset token is invalid or expired", "401");
            console.log("useB", user);
            const hashPassword = await hash(newPassword, 7);
            user.password = hashPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenExpire = undefined;
            await user.save({validateBeforeSave:false});
            // const token = await this.user.({email:user.email}, userModel);
            // console.log("headerTokens", token);
            return "Password resetSuccessfully";
        } catch (error) {
            return error;
        }
    }
}