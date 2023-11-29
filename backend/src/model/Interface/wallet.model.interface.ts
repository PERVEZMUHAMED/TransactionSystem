interface Iwallet {
    currency_id:string,
    currency:string,
    Amount:number
};
export default interface Wallet extends Document {
    user_id:string,
    wallet:Array<Iwallet>
};