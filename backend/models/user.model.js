import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    wallet:{
        type:String,
        required:true,
    },
    tier:{
        type:String,
        required:true,
    },
    validUntil:{
        type:String,
        required:true,
    },
    txHash:{
        type:String,
        required:true,
    }

})

export const User = mongoose.model("User", UserSchema);
export default User;

    