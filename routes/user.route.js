import express from "express"
import { signUpValidation } from "../middlewares/validations.js"
import { signUp, verifyOtp, login,updateUser,getAllUsers,getUserById,deleteUser } from "../controllers/user.controller.js"
const router=express.Router()
//signUp route
router.route("/signUp").post(signUpValidation,signUp)
router.route("/otp-verify").post(verifyOtp)
router.route("/login").post(login);
router.put("/users/:userId", updateUser);
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.delete("/users/:userId", deleteUser);




export default router 