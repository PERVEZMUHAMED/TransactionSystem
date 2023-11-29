export default interface Auditor extends Document {
    user_id:string,
    currency_id:string,
    trasactionId:string,
    pre_balance:number,
    post_balance:number,
    category:string,
};