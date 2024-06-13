const userModel = require("../model/userModal");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // console.log(req.body);


        const user = await userModel.findOne({ email })
        if (user) {
            throw new Error("User already exist please register with different email")

        }
        if (!email) {
            throw new Error("Please provide email")
        }
        if (!password) {
            throw new Error("Please provide password")
        }
        if (!name) {
            throw new Error("Please provide name")
        }


        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedpassword = bcrypt.hashSync(password, salt);


        if (!hashedpassword) {
            throw new Error("Something went wrong in hashed password")
        }

        const payload = {
            ...req.body,
            // role: "GENERAL",
            password: hashedpassword
        }
        const userData = new userModel(payload);
        const saveUser = await userData.save();

        res.status(201).json(
            {
                data: saveUser,
                success: true,
                error: false,
                message: 'User created successfully!'
            }
        )

    } catch (err) {
        // console.log("err",err)
        res.json({
            message: err.message,
            error: true,
            success: false
        })

    }
}


exports.signin = async (req, res) => {
    try{
        const { email , password} = req.body

        if(!email){
            throw new Error("Please provide email")
        }
        if(!password){
             throw new Error("Please provide password")
        }

        const user = await userModel.findOne({email})

       if(!user){
            throw new Error("User not found")
       }

       const checkPassword = await bcrypt.compare(password,user.password)

       console.log("checkPassoword",checkPassword)

       if(checkPassword){
        const tokenData = {
            _id : user._id,
            email : user.email,
        }
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: 60 * 60 * 8 });

        const tokenOption = {
            httpOnly : true,
            secure : true
        }

        res.cookie("token",token,tokenOption).status(200).json({
            message : "Login successfully",
            data : token,
            success : true,
            error : false
        })

       }else{
         throw new Error("Please check Password")
       }





    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }

}


exports.userDetail=async(req,res)=>{

    // console.log(req)
    console.log("userId",req.userId)
    // return 0;
    try{
        // console.log("userId",req.userId)
        const user = await userModel.findById(req.userId)

        res.status(200).json({
            data : user,
            error : false,
            success : true,
            message : "User details"
        })

        console.log("user",user)

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}


exports.logout=(req,res)=>{
    try{

        res.clearCookie('token')

        res.status(200).json({
            data : [],
            error : false,
            success : true,
            message : "Logout successfully"
        })
    }
    catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })  
    }
}
exports.alluser=async (req,res)=>{
    try{

        const users = await userModel.find();
        // console.log("all usrer",users.user)
        

        res.status(200).json({
            data : users,
            error : false,
            success : true,
            message : "All User"
        })
    }
    catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })  
    }
}