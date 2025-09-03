import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        type:{
            type:String,
            enum:['file','folder'],
            required: true
        },
        content: {
            type: String,
        },
        parentId:{
            type:mongoose.Types.ObjectId,
            ref:"File",
            default: null
        },
        projectId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Project", 
            required: true 
        },
    },
    {
      timestamps: true
    }
);

export const File = mongoose.model("File",fileSchema); 
