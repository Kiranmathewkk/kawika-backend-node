const multer = require("multer")
const path = require('path');

const fileStorage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,path.join(__dirname, '/uploads/'))
    },
    filename: (req,file,callback) =>{
        callback(null,Date.now()+file.originalname)
    }
  });

const upload = multer({storage:fileStorage});


const { createUser,
    getUserById,
    getUsers,
    deleteUser,
     login,
     forgetPassword,
     resetPassword, 
     linkResetPassword,
     attendance,
     findAttendance,
     updateAttendance,
     projectCreation,
     allProjects,
     getProjectId,
     taskCreation,
     taskByProjectId,
     taskAssigned,
     getAssignedTaskById,
     updateUser} = require("./user.controller")
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validaton");
const { reset } = require("nodemon");

router.post("/login",login);
router.post("/signup",upload.single('file'),createUser);
router.post("/updateuser",checkToken,upload.single('file'),updateUser)
router.get("/getUsers",checkToken, getUsers);
//router.get("/getuser/:id",checkToken, getUserById);
//router.delete("/deleteuser",checkToken, deleteUser);
router.get("/getuser/:id",checkToken, getUserById);
router.post("/deletuser",checkToken,deleteUser)
router.post("/forgetpassword",forgetPassword);
router.get("/reset-password/:id/:token",resetPassword);
router.post("/reset-password/:id/:token",linkResetPassword);
router.post("/attendance",checkToken,attendance);
router.post("/findattendance",checkToken,findAttendance)
router.post("/updateattendance",checkToken,updateAttendance);
router.post("/projectcreation",checkToken,projectCreation)
router.get("/allproject",checkToken,allProjects)
router.post("/projectbyid",checkToken,getProjectId);
router.post("/createtask",checkToken,upload.single('file'),taskCreation);
router.post("/tasklistbyproject",checkToken,taskByProjectId);
router.post("/assigntask",checkToken,taskAssigned); 
router.post("/assigntaskbyid",checkToken,getAssignedTaskById)
module.exports = router;