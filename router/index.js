const express= require('express');
const router = express.Router();


const userController= require("../controller/user");
const authToken = require('../middleware/authToken');


router.post("/signup",userController.signup)
router.post("/signin",userController.signin)
router.get("/logout",userController.logout)
router.get("/all-user",userController.alluser)
router.get('/user-detail',authToken,userController.userDetail)

module.exports = router;