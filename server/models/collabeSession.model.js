import mongoose from "mongoose";

const collabeSessionSchema = new mongoose.Schema(
    {
        session:{
            type: String,
            required: true
        },
        project:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Project",
            required: true
        },
        admin:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            reuired: true
        },
        role:{
            type: String,
            enum:['editor','reader','admin'],
            required:true
        },
        expiry:{
            type: Date, 
            required: true 
        }
    },
    {
        timestamps: true
    }
);

export const CollabeSession = mongoose.model("CollabeSession",collabeSessionSchema);
