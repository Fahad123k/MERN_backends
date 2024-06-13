const mongoose =require('mongoose');


async function connectDB(){
    try{

        await mongoose.connect(process.env.MONGODB_URI);
        // console.log('connected to database');
    }
    catch(err){
        console.log("error is:",err);
    }
}
module.exports =connectDB