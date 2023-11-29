export default interface IWithdrawRepository {
    create:(args:any, model:any)=>any
    findOne:(args:any, model:any)=>any
    wallet:(args:any, model:any)=>any
    walletUpdate:(args:any, model:any)=>any
};