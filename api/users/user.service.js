

const pool = require("../../config/database")
var uniqid = require('uniqid'); 
const res = require("express/lib/response");
const { genSaltSync,hashSync , compareSync}  = require("bcrypt")



module.exports = {
    create: (data,fileName,callBack)=>{
      
        pool.query(
          `insert into users(id,fullname,email,password,address,position,bloodgroup,employecode,type,profile_image,created_at)
          values(?,?,?,?,?,?,?,?,?,?,?)`,
          [ 
              uniqid(),
              data.fullname,
              data.email,
              data.password,
              data.address,
              data.position,
              data.bloodgroup,
              data.code,
              data.type,
              fileName,
              new Date()
          ],
          (error,results)=>{
              if(error){
                return  callBack(error)
              }
              return callBack(null,results)
          }
        );
    },
    updateUser: (data,fileName,callBack)=>{
      console.log(fileName)
      if(fileName != 'NULL'){
        pool.query(
        
          `UPDATE  users 
              SET fullname=?,
                    email=?,
                    password=?,
                    address=?,
                    position=?,
                    bloodgroup=?,
                    employecode=?,
                    type=?,
                    profile_image=?,
                    created_at=?
                    where id=?`,
                        
          [ 
              //uniqid(),
              data.fullname,
              data.email,
              data.password,
              data.address,
              data.position,
              data.bloodgroup,
              data.code,
              data.type,
              fileName,
              new Date(),
              data.id
          ],
          (error,results)=>{
              if(error){
                return  callBack(error)
              }
              return callBack(null,results)
          }
        );
      } else{
        pool.query(
        
          `UPDATE  users 
              SET fullname=?,
                    email=?,
                    password=?,
                    address=?,
                    position=?,
                    bloodgroup=?,
                    employecode=?,
                    type=?,
                   
                    created_at=?
                    where id=?`,
                        
          [ 
              //uniqid(),
              data.fullname,
              data.email,
              data.password,
              data.address,
              data.position,
              data.bloodgroup,
              data.code,
              data.type,
              
              new Date(),
              data.id
          ],
          (error,results)=>{
              if(error){
                return  callBack(error)
              }
              return callBack(null,results)
          }
        );
      }
      
      
  },
    getUsers: callBack =>{
        pool.query(
            `select * from users`,
            [],
            (error,result)=>{
                if(error){
                    return callBack(error);
                }
                return callBack(null,result)
            }
        )
    } ,
    getUserById: (id,callBack)=>{
        pool.query(
          `select * from users where id = ?`,
          [ 
            id
          ],
          (error,results)=>{
              if(error){
                return  callBack(error)
              }
              return callBack(null,results[0])
          }
        );
    },
    deletUser: (data,callBack)=>{
        pool.query(
          `delete from users where id= ?`,
          [ 
             data.id
          ],
          (error,results)=>{
              if(error){
                return  callBack(error)
              }
              return callBack(null,results[0])
          }
        );
    },
    getUserByEmail:(email,callBack)=>{
      pool.query(
        `select * from users where email =?`,
        [email],
        (err,result)=>{
          if(err){
            return callBack(err)
          }
          return callBack(null,result[0])
        }
      )

    },
    updatePassword:(data,callBack)=>{
      const salt = genSaltSync(10);
      data.password = hashSync(data.password, salt);
      pool.query(
        `UPDATE  users 
         SET 
          password = ?
  
           where email = ?`,
           [data.password,
            data.email
          ],
          (err,result)=>{
            if(err){
              return callBack(err)
            }
            return callBack(null,result)
          }
      )
    },
    userAttendance: (data,callBack)=>{
      var today = new Date()
      var todayDate = new Date();
      var dd = String(todayDate.getDate()).padStart(2, '0');
      var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = todayDate.getFullYear();
      todayDate = dd +'/'+ mm + '/' + yyyy;
      console.log(data)
      pool.query(
        `insert into attendance (id,user_id,check_in,check_out,location,date_now,created_at) 	
        values(?,?,?,?,?,?,?)`,
        [ 
            uniqid(),
            data.user_id,
            data.check_in,
            data.check_out,
            data.location,
            todayDate,
            today
        ],
        (error,results)=>{
            if(error){
              return  callBack(error)
            }
            return callBack(null,results)
        }
      );
    },
    updateAttendance:(data,callBack)=>{
      var sqlQuery
      var todayDate = new Date();
      var dd = String(todayDate.getDate()).padStart(2, '0');
      var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = todayDate.getFullYear();
      todayDate = dd +'/'+ mm + '/' + yyyy;
      
      if(data.statusValue==2){
        console.log("2",data.statusValue)
        sqlQuery = `UPDATE  attendance
        SET 
         check_out = ?
 
          where user_id = ? and date_now = ? `
      }
      if(data.statusValue == 3){
        console.log("3",data.statusValue)
        sqlQuery = `UPDATE  attendance
        SET 
        second_check_in = ?
 
          where user_id = ? and date_now = ? `
      }
      if(data.statusValue==4){
        console.log("4",data.statusValue)
        sqlQuery = `UPDATE  attendance
        SET 
        second_check_out = ?
 
          where user_id = ? and date_now = ? `
      }
      pool.query(
            sqlQuery,
           [
             data.check_out,
            data.user_id,
            todayDate
          ],
          (err,result)=>{
            if(err){
              return callBack(err)
            }
            return callBack(null,result)
          }
      )
    },
    attendanceByDate:(data,callBack)=>{
      console.log(data)
      var todayDate = new Date();
      var dd = String(todayDate.getDate()).padStart(2, '0');
      var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = todayDate.getFullYear();
      todayDate = dd +'/'+ mm + '/' + yyyy;
      pool.query(
        `select * from attendance where user_id = ? and date_now = ?   `,
        [ 
          data.user_id,
          todayDate
          
        ],
        (error,results)=>{
            if(error){
              return  callBack(error)
            }
            return callBack(null,results[0])
        }
      );
    },
    createProject: (data,callBack)=>{
      // var today = new Date()
      // var todayDate = new Date();
      // var dd = String(todayDate.getDate()).padStart(2, '0');
      // var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
      // var yyyy = todayDate.getFullYear();
      // todayDate = dd +'/'+ mm + '/' + yyyy;
      console.log(data)
      pool.query(
        `insert into project (id,title,description,start_date,end_date,dead_line,cost,client_name,client_email,client_phone,client_address) 	
        values(?,?,?,?,?,?,?,?,?,?,?)`,
        [ 
            uniqid(),
            data.title,
            data.descrition,
            data.startDate,
            data.endDate,
            data.deadLine,
            data.cost,
            data.client_name,
            data.client_email,
            data.client_phone,
            data.client_address
        ],
        (error,results)=>{
            if(error){
              return  callBack(error)
            }
            return callBack(null,results)
        }
      );
    },
    allProjects:callBack=>{
      pool.query(
        `select * from project`,
        [],
        (error,result)=>{
            if(error){
                return callBack(error);
            }
            return callBack(null,result)
        }
    )     
    },
    getProjectById:(data,callBack)=>{
      pool.query(
        `select * from project where id =?`,
        [data.id],
        (err,result)=>{
          if(err){
            return callBack(err)
          }
          return callBack(null,result[0])
        }
      )

    },
    taskCreate: (data,fileName,callBack)=>{
       var today = new Date()
      pool.query(
        `insert into tasks(id,project_id,title,description,start_date,end_date,hours,createdby_user_id,createdby_fullname,attachment,created_at)
        values(?,?,?,?,?,?,?,?,?,?,?)`,
        [ 
            uniqid("task"),
            data.project_id,
            data.title,
            data.descrition,
            data.startDate,
            data.endDate,
            data.hrs,
            data.user_id,
            data.fullname,
            fileName,
            today
        ],
        (error,results)=>{
            if(error){
              return  callBack(error)
            }
            return callBack(null,results)
        }
      );
    },
    updateTask: (data,callBack)=>{
      var today = new Date()
     pool.query(
       `UPDATE tasks
        SET project_id=?,
           title=?,
           description=?,
           start_date=?,
           end_date=?,
           hours=?,
           createdby_user_id=?,
           createdby_fullname=?,
           created_at=?
           where id=?`,
       [ 
           
           data.project_id,
           data.title,
           data.descrition,
           data.startDate,
           data.endDate,
           data.hrs,
           data.user_id,
           data.fullname,
           today,
           data.task_id
       ],
       (error,results)=>{
           if(error){
             return  callBack(error)
           }
           return callBack(null,results)
       }
     );
    },
    
    getTaskProjectId: (data,callBack)=>{
      pool.query(
        `select * from tasks where project_id =?`,
        [data.project_id],
        (err,result)=>{
          if(err){
            return callBack(err)
          }
          return callBack(null,result)
        }
      )

    },
    assignTask:(data,callBack)=>{
      // const salt = genSaltSync(10);
      // data.password = hashSync(data.password, salt);
      console.log(data)
      pool.query(
        `insert into task_assigned (id,task_id,user_id,fullname,email,assignby_user_id,assignby_fullname,project_id,assign_date)
         values(?,?,?,?,?,?,?,?,?)`,
           [
            uniqid("54gJGJ"),
            data.task_id,
            data.user_id,
            data.fullname,
            data.email,
            data.assignbyId,
            data.assignbyFullname,
            data.project_id,
            new Date()
          ],
          (err,result)=>{
            if(err){
              return callBack(err)
            }
            return callBack(null,result)
          }
      )
    },
    assignTaskById: (data,callBack)=>{
      pool.query(
        `select fullname,email,assignby_fullname,assign_date from task_assigned where task_id =?`,
        [data.task_id],
        (err,result)=>{
          if(err){
            return callBack(err)
          }
          return callBack(null,result)
        }
      )

    },
    statusChangeOnTask : (data,callBack)=>{
        pool.query(
          `UPDATE  tasks 
           SET 
            status = ?
    
             where id = ?`,
             [
              'assigned',
              data.task_id
            ],
            (err,result)=>{
              if(err){
                return callBack(err)
              }
              return callBack(null,result)
            }
        )
      
    }
}