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
        if(context.users._id ==  args._id) {
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
                        // if(!verifyToken) throw new ApolloError("Unauthorized User", "401");
                        const user = await this.user.findById(decoded._id, userModel);
                        return user;
                    } catch (error) {
                        return error;
                    }
                }
}