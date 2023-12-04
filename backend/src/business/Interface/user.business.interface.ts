export default interface IUserBusiness {
    Register:(args:any)=>any;
    Login:(args:any)=>any;
    Verifytoken:(args:any)=>any
    GetUser:(args:any, context:any)=>any
    changePassword:(args:any, context:any)=>any
}