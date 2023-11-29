import {connect} from "mongoose";

export default class Database {

    public dtabaseConnection=()=>{
        const {MONGODB_URL} = process.env;
        connect(MONGODB_URL)
        .then((con)=>{
            console.log(`Database is Connected`);
        })
        .catch((err)=>{
            console.log(`Database is not connected ${err}`);
        });
    }
};