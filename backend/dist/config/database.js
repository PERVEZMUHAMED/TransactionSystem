"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class Database {
    constructor() {
        this.dtabaseConnection = () => {
            const { MONGODB_URL } = process.env;
            (0, mongoose_1.connect)(MONGODB_URL)
                .then((con) => {
                console.log(`Database is Connected`);
            })
                .catch((err) => {
                console.log(`Database is not connected ${err}`);
            });
        };
    }
}
exports.default = Database;
;
