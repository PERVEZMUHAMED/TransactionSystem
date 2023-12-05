"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const Types_1 = require("../di/Types");
const user_model_1 = __importDefault(require("../model/user.model"));
const mongoose_1 = require("mongoose");
const apollo_server_express_1 = require("apollo-server-express");
let objectId = mongoose_1.Types.ObjectId;
let GetUserBusiness = class GetUserBusiness {
    constructor(_getuser) {
        this._getuser = _getuser;
        this.getSpecificUserAuditorDetails = (args, context) => __awaiter(this, void 0, void 0, function* () {
            if (context.users) {
                try {
                    const getspecificuserauditordetails = yield this.getuser.getUserDetail([
                        { $match: { _id: new objectId(args._id) } },
                        {
                            $lookup: {
                                from: "auditors",
                                pipeline: [
                                    {
                                        $sort: {
                                            createdAt: -1
                                        }
                                    }
                                ],
                                as: "auditorDetails"
                            }
                        }
                    ], user_model_1.default);
                }
                catch (error) {
                    return error;
                }
            }
            else {
                throw new apollo_server_express_1.ApolloError("You not have access to handle this resource", "401");
            }
        });
        this.getSpecificUserAllDetails = (args, context) => __awaiter(this, void 0, void 0, function* () {
            if (context.users._id == args._id) {
                try {
                    const user = yield this.getuser.getUserDetail([
                        { $match: { _id: new objectId(args._id) } },
                        {
                            $lookup: {
                                from: "wallets",
                                localField: "_id",
                                foreignField: "user_id",
                                as: "walletDetails"
                            },
                        },
                        {
                            $lookup: {
                                from: "deposits",
                                localField: "_id",
                                foreignField: "user_id",
                                as: "depositDetails"
                            },
                        },
                        {
                            $lookup: {
                                from: "withdraws",
                                localField: "_id",
                                foreignField: "user_id",
                                as: "withdrawDetails"
                            },
                        },
                        {
                            $lookup: {
                                from: "auditors",
                                pipeline: [
                                    {
                                        // $match:{
                                        $sort: {
                                            createdAt: -1
                                        }
                                        // }
                                    }
                                ],
                                // localField:"_id",
                                // foreignField:"user_id",
                                as: "auditorDetails"
                            },
                        },
                    ], user_model_1.default);
                    console.log("user", user);
                    return user;
                }
                catch (error) {
                    return error;
                }
            }
            else {
                return new apollo_server_express_1.ApolloError("You Not have access to handle this resources");
            }
        });
        this.getSpecificUserAuditorDetailsFDTD = (args, context) => __awaiter(this, void 0, void 0, function* () {
            if (context.users) {
                try {
                    const getspecificuserauditorFDTD = yield this.getuser.getUserDetail([
                        { $match: { _id: new objectId(args._id) } },
                        {
                            $lookup: {
                                from: "auditors",
                                pipeline: [
                                    {
                                        $match: {
                                            createdAt: {
                                                $gte: new Date(args.FromDate),
                                                $lte: new Date(args.ToDate)
                                            }
                                        }
                                    }
                                ]
                            },
                        },
                    ], user_model_1.default);
                    if (!getspecificuserauditorFDTD)
                        throw new apollo_server_express_1.ApolloError("the data not found");
                    return getspecificuserauditorFDTD;
                }
                catch (error) {
                    return error;
                }
            }
            else {
                return new apollo_server_express_1.ApolloError("you not have access to handle this resource", "401");
            }
        });
        this.getuser = _getuser;
    }
};
GetUserBusiness = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(Types_1.TYPES.Getuser)),
    __metadata("design:paramtypes", [Object])
], GetUserBusiness);
exports.default = GetUserBusiness;
