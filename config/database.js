const {createPool} = require("mysql")

const pool = createPool({
    port:3306,
    host:"localhost",
    user:"root",
    password:"",
    database:"project-management",
    connectionLimit:10
})

// const pool = createPool({
//     port:3306,
//     host:"localhost",
//     user:"sql_hrtask_kawik",
//     password:"Y5KT37TnDwwL3eJF",
//     database:"sql_hrtask_kawik",
//     connectionLimit:10
// })

module.exports = pool;



