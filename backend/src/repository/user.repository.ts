import {injectable} from "inversify";
import "reflect-metadata";
import { ApolloError } from "apollo-server-errors";
import IUserRepository from "./Interface/user.repository.interface";

@injectable() 
export default class UserRepository implements IUserRepository {

    public create = async(args, model)=>{
        try {
            const create = await model.create(args);
            if(!create) throw new ApolloError("401", "user not Created");
            return create;
        } catch (error) {
            return error;
        }
    };
    public findOne = async(args, model)=>{
        try {
            const findUser = await model.findOne(args);
            return findUser;
        } catch (error) {
            return error;
        }
    }
    public find = async(args, model)=>{
        try {
            const find = await model.find();
            return find;
        } catch (error) {
            return error;
        }
    }
};