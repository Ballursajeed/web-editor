import { User } from "../models/user.model.js";

export const register = async(req,res) => {
    try {
        
        const { username,fullName,email,password } = req.body;

        if(!username || !fullName || !email || !password){
            return res.status(400).json({
                message:"All fields are required!",
                success: false
            });
        }

        const exitedUsername = await User.findOne({username});

        if(exitedUsername) {
             return res.status(400).json({
                message:"Username is already in use!",
                success: false
            });
        }

        const exitedEmail = await User.findOne({email});

        if(exitedEmail) {
             return res.status(400).json({
                message:"Email is already in use!",
                success: false
            });
        }

          const user = await User.create({
            email,
            username,
            password,
            fullName
        });

        return res.status(201).json({
            message: "User registered Successfully",
            success: true,
            user
        });


    } catch (error) {
        return res.status(500).json({
            message:"Something went wrong,please try again later",
            success: false,
            error: error.message
        });
    }
}

export const userLogin = async(req,res) => {
    try {
        
        const { username,password } = req.body;
        
        if(!username || !password) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false,
            })
        }

        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({
                message: "Username not found!",
                success: false
            })
        }

        const isPasswordCorrect = await user.isPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message: "username or password is incorrect!",
                success: false
            })
        }

        const accessToken = user.generateAccessToken();
         const option = {
          secure: true,
          sameSite: 'none',
          path: '/',
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        user.refreshToken = accessToken
        await user.save({validateBeforeSave:false});

        return res.
               status(200).
               cookie("accessToken",accessToken,option).
               json({
                message: "User loggedIn successfully!",
                success: true,
                user,
                accessToken
               })

    } catch (error) {
        console.log("error login:",error);
        
        return res.status(500).json({
                message: "Something went wrong,please try again later",
                success: false,
                error,
            });
    }
}

export const userLogout = async(req,res) => {
    try {
         const id = req.user;
    
         const user = await User.findByIdAndUpdate(id,{
        $unset:{
            refreshToken: null
        },
    },
       {
          new: true
       }
    )
     res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true        
    });
    
    res.status(200).json({
        message: "User LoggedOut Successfully!",
        success: true,
        user
    })
    } catch (error) {
         return res.status(500).json({
                message: "Something went wrong,please try again later",
                success: false,
                error,
            });
    }
}

export const checkAuth = async(req,res) => {
    try {
        
        const  userId  = req.user;

        if(!userId){
            return res.status(400).json({
                message: "Not Authenticated!",
                success: false
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message: "User not Found!",
                success: false
            })
        }

        return res.status(200).json({
            message: "user is Authenticated",
            success: true,
            user
        })
 
    } catch (error) {
         return res.status(500).json({
                message: "Something went wrong,please try again later",
                success: false,
                error,
            });
    }
}

export const getUser = async(req,res) => {
    try {
        
        const { id } = req.params;

        const user = await User.findById(id);

        if(!user) {
            return res.status(404).json({
                message: "User not Found!",
                success: false
            });
        }

        return res.status(200).json({
            message: "user fetched successfully!",
            success: true,
            user
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong!",
            success: false,
            error: error.message
        })
    }
}