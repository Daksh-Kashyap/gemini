import express from "express";
import {register , login} from "../Controller/authController.js"

let router=express.Router();

router.post("/register",register);
router.post("/login",login);

export default router;