

const jwt = require('jsonwebtoken')
const jwt_secret = 'super secret....'
const nodemailer = require('nodemailer')
var transport = nodemailer.createTransport({
    service:' gmail ',
    auth:{
        user:'kiranmathewkkm@gmail.com',
        pass:'kirankkm00000'
    },
    tls: {
        rejectUnauthorized: false
    }
})
const { create , 
    getUserById ,
    getUsers ,
    deletUser,
getUserByEmail,
updatePassword,
userAttendance,
attendanceByDate,
updateAttendance,
createProject,
allProjects,
getProjectById,
taskCreate,
getTaskProjectId,
assignTask,
statusChangeOnTask,
assignTaskById,
updateTask,
updateUser
 } = require("./user.service")
const { genSaltSync,hashSync , compareSync}  = require("bcrypt")
const { sign } = require("jsonwebtoken");
const { json } = require('express/lib/response')



// sendMail(link){
//     transport.sendMail({
//      from:"kiranmathewkkm@gmail.com",
//      to:'kiran@kawikatechnologies.com',
//      subject:"Reset password",
//      text: link  
//     },(err,result)=>{
//       if(err){
//           console.log(err)
//       }else{
//           console.log(result.response)
//       }
//     })
// }
 

module.exports = {
    createUser: (req,res)=>{
       // const body = req.body
       const body =JSON.parse(req.body.data) 
       console.log("---",req.file)
       var  fileName ='NULL'
       if(req.file != undefined){
         fileName = req.file.filename
       }
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        getUserByEmail(body.email, (err,result)=>{
            if(err){
                console.log(err)
            }
            if(result){
                return res.json({
                    success:401,
                    message:"Email Exists"
                });

            }else{
            // if(fileName==undefined){
            //   fileName ='NULL'
            // }
        create(body,fileName,(err,results)=>{
            if(err){
                console.log(err);
                return res.status(500).json({
                    success:401,
                    message:"Connection error"
                })
            }
            return res.status(200).json({
                 success:200,
                 message:"Created successful"
            })
        })
    }
    })
    },
    getUserById: (req , res)=>{
        const id = req.params.id;
        getUserById(id,(err,result)=>{
            if(err){
                console.log(err)
                return;
            }
            if(!result){
                return res.json({
                    success:200,
                    message:"not fount"
                })
            }
            return res.json({
                success:200,
                message: result
            })
        })
    },
    getUsers: (req,res)=>{
        getUsers((err,result)=>{
            if(err){
                console.log(err)
                return;
            }
            return res.json({
                success:200,
                message:result

            })
        })
    },
    deleteUser: (req,res)=>{
        const data = req.body
        deletUser(data,(err,result)=>{
          if(err){
              console.log(err)
              return;
          }
        //   if(!result){
        //       return res.json({
        //         success:200,  
        //         message:"not fount"
        //       })
        //   }
          return res.json({
              success:200,
              message:"deleted"

          })
        })
    },
    updateUser: (req,res)=>{
        //const data = req.body
        const body =JSON.parse(req.body.data) 
       console.log("---",req.file)
       var  fileName ='NULL'
       if(req.file != undefined){
         fileName = req.file.filename
       }
        updateUser(body,fileName,(err,result)=>{
          if(err){
              console.log(err)
              return;
          }
        //   if(!result){
        //       return res.json({
        //         success:200,  
        //         message:"not fount"
        //       })
        //   }
          return res.json({
              success:200,
              message:"Updated Successfully"

          })
        })
    },
    login: (req,res)=>{
        console.log(req.params)
        const body = req.body;
        getUserByEmail(body.email,(err,result)=>{
            if(err){
                console.log(err)
            }
            if(!result){
                return res.json({
                    success:401,
                    message:"invalid email or password"
                });

            }
            const resultData = compareSync(body.password,result.password)
            if(resultData){
                result.password = undefined
                const jwt = sign({results :result },"secretkey",{
                    expiresIn:"12h"
                });
                return res.json({
                    success:200,
                    message: "login successfully",
                    token:jwt,
                    user: result
                })
            } else {
                return res.json({
                    success:401,
                    message:"invalid email or password"
                })
            }
        })
    },
    forgetPassword: (req,res) =>{
        const body = req.body;
        
        getUserByEmail(body.email,(err,result)=>{
            if(err){
                console.log(err)
            }
            if(!result){
                return res.json({
                    success:401,
                    message:"invalid email or password"
                });

            }
         const secret = jwt_secret + result.password
         const payload = {
             email: result.email,
             id: result.id
         }  
         const token = jwt.sign(payload,secret,{expiresIn:'15m'})
         const link  = `http://localhost:3000/api/users/reset-password/${result.id}/${token}`
         transport.sendMail({
            from:"kiranmathewkkm@gmail.com",
            to:'kiran@kawikatechnologies.com',
            subject:"Reset password",
            text: link  
           },(err,result)=>{
             if(err){
                 console.log(err)
             }else{
                 console.log(result.response)
             }
           })
         return res.json({
             success:200,
             message:"link send to email address"
         })

         
        })
    },
    resetPassword: (req,res)=>{
        const { id , token} = req.params;
        getUserById(id,(err,result)=>{
            if(err){
                console.log(err)
            }
            if(!result){
                return res.json({
                    success:401,
                    message:"invalid user"
                });

            }
            const secret = jwt_secret + result.password
            try{
              const payload = jwt.verify(token,secret)
              res.render('reset-password',{email: result.email})
            }catch(e){
                console.log(e)
            }
        })
    },
    linkResetPassword : (req,res)=>{
        const { id , token} = req.params;
        console.log(req.body)
        const {password, password2} = req.body;
        getUserById(id,(err,result)=>{
            if(err){
                console.log(err)
            }
            if(!result){
                return res.json({
                    success:401,
                    message:"invalid user"
                });

            }
            const secret = jwt_secret + result.password

            try{
              const payload = jwt.verify(token,secret)
              
              if(password == password2){
                  result.password = password
                  console.log(password,password2)
                  updatePassword(result,(err,result)=>{
                   if(err){
                       return res.json({
                           message:"Database Error!"
                       })
                   }else{
                    return res.json({
                        message:"Password Succesfully Changed"
                    })
                   }
                  })

                
              }else{
              return res.json({
               "message": "Passwod not match"   
              })
            }
              //res.render('reset-password')
            }catch(e){
                console.log(e)
                return res.json({
                    "message":e.message
                })
            }
        })
    },
    attendance: (req,res)=>{
        const body = req.body
        // const salt = genSaltSync(10);
        // body.password = hashSync(body.password, salt);
        userAttendance(body, (err,result)=>{
            if(err){
                console.log(err)
            }
            if(result){ 
                return res.json({
                    success:200,
                    message:"Attendance added"
                });

            }else{
             return res.json({
                 success:401,
                 message:"Error"
             })
       
      }
     })
    },
    findAttendance: (req,res)=>{
        const body = req.body
        // const salt = genSaltSync(10);
        // body.password = hashSync(body.password, salt);
        attendanceByDate(body, (err,result)=>{
            if(err){
                console.log(err)
            }
            if(result){ 
                return res.json({
                    success:200,
                    data: result,
                    message:"Attendance fetched"

                });

            }else{
             return res.json({
                 success:401,
                 message:"Error"
             })
       
      }
     })
    },
    updateAttendance: (req,res)=>{
        const body = req.body


        updateAttendance(body, (err,result)=>{
            if(err){
                console.log(err)
            }
            if(result){ 
                return res.json({
                    success:200,
                    data: result,
                    message:"Attendance Updated"

                });

            }else{
             return res.json({
                 success:401,
                 message:"Error"
             })
       
      }
     })
    },
    projectCreation:(req,res)=>{
        const body = req.body
        createProject(body, (err,result)=>{
            if(err){
                console.log(err)
            }
            if(result){ 
                return res.json({
                    success:200,
                    data: result,
                    message:"Project Updated"

                });

            }else{
             return res.json({
                 success:401,
                 message:"Error"
             })
       
      }
     })
    },
    allProjects: (req,res)=>{
        allProjects((err,result)=>{
            if(err){
                console.log(err)
                return;
            }
            return res.json({
                success:200,
                message:result

            })
        })
    },
    getProjectId: (req,res)=>{
        const body = req.body
        getProjectById(body,(err,result)=>{
            if(err){
                console.log(err)
                return;
            }
            return res.json({
                success:200,
                message:result

            })
        })
    },
    taskCreation: (req,res)=>{
        const body =JSON.parse(req.body.obj) 
        console.log(body)
        // var  fileName = req.file
        // console.log("file",fileName.filename)
        var resultData =[]; 
        var  fileName ='NULL'
       if(req.file != undefined){
         fileName = req.file.filename
       }
    if(!body.status ){
        taskCreate(body,fileName,(err,result)=>{
            if(err){
                console.log(err)
                return;
            }
            getTaskProjectId(body,(err,result)=>{
                if(err){
                    console.log(err)
                    return;
                }
                return res.json({
                    success:200,
                    message:result
    
                })
            })

        })  
    }else{ 
        updateTask(body,(err,result)=>{
            if(err){
                console.log(err)
                return;
            }
            getTaskProjectId(body,(err,result)=>{
                if(err){
                    console.log(err)
                    return;
                }
                return res.json({
                    success:200,
                    message:result
    
                })
            })
        })  
    }
    
       
     
    },
    taskByProjectId: (req,res)=>{
        const body = req.body
        getTaskProjectId(body,(err,result)=>{
            if(err){
                console.log(err)
                return;
            }
            return res.json({
                success:200,
                message:result

            })
        })
    },
    taskAssigned:(req,res)=>{
        const body = req.body
        assignTask(body,(err,result)=>{
            if(err){
                console.log(err)
                return res.json({
                    message:err
                })
            }
        statusChangeOnTask(body,(err,result)=>{
            if(err){
                console.log(err)
                return res.json({
                    message:err
                })
            }
           })
            return res.json({
                success:200,
                message:"Successfuly added"
            })
        })

    },
    getAssignedTaskById:(req,res)=>{
        const body = req.body
        assignTaskById(body,(err,result)=>{
            if(err){
                console.log(err)
                return;
            }
            return res.json({
                success:200,
                message:result

            })
        })
    }
    
}

