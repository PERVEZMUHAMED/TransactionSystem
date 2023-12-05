import { inject, injectable } from "inversify";
import IGetUserBusiness from "./Interface/getuser.business.interface";
import IGetUserRepository from "../repository/Interface/getuser.repository.interface";
import { TYPES } from "../di/Types";
import userModel from "../model/user.model";
import { Types } from "mongoose";
import { ApolloError } from "apollo-server-express";
let objectId = Types.ObjectId;

@injectable()
export default class  GetUserBusiness implements IGetUserBusiness {
    private readonly getuser:IGetUserRepository;
    constructor(
        @inject(TYPES.Getuser) private _getuser:IGetUserRepository
    )   {
        this.getuser = _getuser;
    }

    public getSpecificUserAuditorDetails =async(args, context)=>{
        if(context.users) {
            try {
                const getspecificuserauditordetails = await this.getuser.getUserDetail([
                    {$match:{_id: new objectId(args._id)}},
                    {
                        $lookup:{
                            from:"auditors",
                            pipeline:[
                                {
                                    $sort:{
                                        createdAt:-1
                                    }
                                }
                            ],
                            as:"auditorDetails"
                        }
                    }
                ],userModel) 
            } catch (error) {
                return error;
            }
        } else {
            throw new ApolloError("You not have access to handle this resource","401");
        }
    }

    public getSpecificUserAllDetails = async(args: any, context: any) => {
        if(context.users._id == args._id) {
            try {
                const user = await this.getuser.getUserDetail([
                    {$match:{ _id:new objectId(args._id)}},
                    {
                        $lookup:{
                            from:"wallets",
                            localField:"_id",
                            foreignField:"user_id",
                            as:"walletDetails"
                        },
                    },
                    {
                        $lookup:{
                            from:"deposits",
                            localField:"_id",
                            foreignField:"user_id",
                            as:"depositDetails"
                        },
                    },
                    {
                        $lookup:{
                            from:"withdraws",
                            localField:"_id",
                            foreignField:"user_id",
                            as:"withdrawDetails"
                        },
                    },
                    {
                        $lookup:{
                            from:"auditors",
                            pipeline:[
                                {
                                    // $match:{
                                        $sort: {
                                            createdAt:-1
                                        }
                                    // }
                                }
                            ],
                            // localField:"_id",
                            // foreignField:"user_id",
                            as:"auditorDetails"
                        },
                    },
                ],userModel);
                console.log("user", user);
                return user;
            } catch (error) {
                return error;
            }
        } else {
            return new ApolloError("You Not have access to handle this resources");
        }
    }
    public getSpecificUserAuditorDetailsFDTD = async(args, context)=>{
        if(context.users) {
            try {
                const getspecificuserauditorFDTD = await this.getuser.getUserDetail([
                    {$match: {_id: new objectId(args._id)}},
                    {
                        $lookup:{
                            from:"auditors",
                            pipeline:[
                                {
                                    $match:{
                                        createdAt:{
                                        $gte: new Date(args.FromDate),
                                        $lte: new Date(args.ToDate)
                                        }
                                    }
                                }
                            ]

                        },
                    },
                ],userModel);
                if(!getspecificuserauditorFDTD) throw new ApolloError("the data not found");
                return getspecificuserauditorFDTD;
            } catch (error) {
                return error;
            }
        }else {
            return new ApolloError("you not have access to handle this resource", "401");
        }
    } 
}