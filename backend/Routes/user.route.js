import express from 'express';
const router = express.Router();
import {Savedata} from '../Controllers/user.controller.js';



router.route("/user/payment").post(Savedata);


export default router;