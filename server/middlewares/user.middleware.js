import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


export const validateUser = async(req,res,next) => {

 try {
       const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","");
       
       console.log(token);
       
   
       if (!token) {
           return res.status(400).json({
               message:"Please Login first!",
               success: false
           })
       }
   
       const decode = jwt.verify(token,process.env.ACCESS_TOKEN);

       const user = await User.findById(decode._id).select("-password");
   
       if (!user) {
           return res.status(400).json({
               message: "Invalid Access Token",
               status: 400,
            }) 
         }
   
       req.user = user?._id;
       
     next()
 } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Invalid or Expired Token",
            status: 401,
        });
    }
    
    return res.status(500).json({
               message: "Something went wrong",
               status: 500,
            }) 
 }

}