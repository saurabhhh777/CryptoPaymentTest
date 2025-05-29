import mongoose from "mongoose";


const ConnectDB = async ()=>{
    try {

        await mongoose.connect("mongodb+srv://CryptoPaymentTest:<db_password>@cluster0.d0mioa3.mongodb.net/CryptoPaymentTest")
        .then(()=>{
            console.log("MongoDb is connected !");
        })

    } catch (error) {
        console.log(error);
    }

}

export default ConnectDB;