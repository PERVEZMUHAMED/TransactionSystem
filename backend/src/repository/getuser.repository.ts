import { injectable } from "inversify";
import "reflect-metadata";
import IGetUserRepository from "./Interface/getuser.repository.interface";

@injectable()
export default class GetUserRepository implements IGetUserRepository {

    public  getUserDetail = async(args: any, model:any) => {
        try {
            const getuser = await model.aggregate(args);
            return getuser;
        } catch (error) {
            return error;
        }
    };
}