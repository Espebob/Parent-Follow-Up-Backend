import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
   FirstName: {
        type: String
    },
    LastName: {
        type: String
    },
   Email:{
    type:String
   },
   Password:{
    type:String
   },
   ConfirmPassword:{
type:String
   },
   otp:{
      type:Number,
      required:true
  },
  otpExpires:{
      type:Date,
      required:false
  },
  verified:{
      type:Boolean,
      required:true,
      default:false
  }
   
})
const userModel=mongoose.model("SignUp",userSchema)
export default userModel