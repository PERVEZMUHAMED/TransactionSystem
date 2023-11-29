import "reflect-metadata";
import {injectable, inject} from "inversify";
import IUserRepository from "../repository/Interface/user.repository.interface";
import { Types } from "../di/Types";
import {compare, hash} from "bcrypt";
import {ApolloError} from "apollo-server-errors";
import IUserBusiness from "./Interface/user.business.interface";
import userModel from "../model/user.model";
import currencyModel from "../model/currency.model";
import walletModel from "../model/wallet.model";
import jwt from "jsonwebtoken";

@injectable()
export default class UserBusiness implements IUserBusiness  {
    private readonly user: IUserRepository;
    constructor(
        @inject(Types.User) private _user:IUserRepository
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
            const createUser = await this.user.create({password:hashPassword, ...args.input}, userModel);
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
            if(!existEmail) return new ApolloError("Please, do the registration and then login");
            const validPw = await compare(password, existEmail.password);
            if(!validPw) return new ApolloError("401", "Email or Password is invalid");
            const {JWT_SECRET, JWT_EXPIRES_TIMES} = process.env;
            const token = jwt.sign({_id:existEmail._id}, JWT_SECRET,
            {expiresIn: JWT_EXPIRES_TIMES});
            return token;
        } catch (error) {
            return error;           
        }
    }
}