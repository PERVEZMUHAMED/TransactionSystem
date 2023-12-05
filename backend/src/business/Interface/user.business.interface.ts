export default interface IUserBusiness {
    Register:(args:any)=>any;
    Login:(args:any)=>any;
    Verifytoken:(args:any)=>any
    GetUser:(args:any, context:any)=>any
    forgotPassword:(args:any)=>any
    sendResetPasswordEmail:(args:any)=>any
    resetPassword:(args:any)=>any
    changePassword:(args:any, context:any)=>any
}