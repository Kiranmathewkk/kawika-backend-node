const { verify} = require("jsonwebtoken")

module.exports = {
    checkToken : (req, res,next) => {
      let token = req.get("authorization");
      if(token){
          token = token.slice(7);
          verify(token,"secretkey",(err,decoded)=>{
              if(err){
                  res.status(401).send('Unothorized Token')
              }else{
                  next();
              }
          })

      }else{
        res.status(401).send('Access Denied')
      }
    }
}