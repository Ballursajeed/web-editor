import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true
        },
        password:{
           type: String,
           required: true
        },
        fullName:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        refreshToken:{
          type:String,
        },
        file:{
            type: mongoose.Types.ObjectId,
            ref: "File"
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save",async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.isPassword = async function(password) {
    const isMatch = await bcrypt.compare(password,this.password);
    return isMatch;
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
        _id: this._id  
        },
        process.env.ACCESS_TOKEN,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}

export const User = mongoose.model("User",userSchema);