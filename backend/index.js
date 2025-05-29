import express from "express";
import cors from "cors";
const app = express();
import ConnectDB from "./utils/db.js";
import userRoutes from "./Routes/user.route.js";




//database connection
ConnectDB();

const PORT = process.env.PORT || 3000;
app.use(cors());    
app.use(express.json());



app.use("/api/v1/", userRoutes);




app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
