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
   role:{
    type:String,
    required:true,
    enum:{
        values:['admin', 'user','teacher', 'parent'],
        message:'Role must be admin or user.'
    },
    default:'user'
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