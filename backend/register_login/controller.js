const assert = require('assert');

module.exports = function(usecase) {
  async function registerFaculty(req, res, next) {
    try {
        const cwid = req.body.cwid;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const fname = req.body.fname;
        const lname = req.body.lname;
        
        const result = await usecase.registerFaculty({cwid, username, email, password, fname, lname});

         if(result == 0)
         {
            res.send({success: false, message:'CWID is invalid'});
         }
         else if(result == 1)
         {
            res.send({success: false, message:'Username is invalid'});
         }
         else if(result == 2)
         {
            res.send({success: false, message:'Email is invalid'});
         }
         else if(result == 3)
         {
            res.send({success: false, message:'Password is invalid'});
         }
         else if (result == 4)
         {
            res.send({success: false, message: 'Name is invalid'});
         }
         else {
            res.send({success:true, user: result});
         }
    } catch(err) {
        res.send({success: false, message: err.message });
    }
  }

  async function registerStudent(req, res, next) {
    try {
      const cwid = req.body.cwid;
      const username = req.body.username;
      const email = req.body.email;
      const password = req.body.password;
      const fname = req.body.fname;
      const lname = req.body.lname;

      const result = await usecase.registerStudent({cwid, username, email, password, fname, lname});

       if(result == 0)
       {
          res.send({success: false, message:'CWID is invalid'});
       }
       else if(result == 1)
       {
          res.send({success: false, message:'Username is invalid'});
       }
       else if(result == 2)
       {
          res.send({success: false, message:'Email is invalid'});
       }
       else if(result == 3)
       {
          res.send({success: false, message:'Password is invalid'});
       }
       else if (result == 4)
       {
          res.send({success: false, message: 'Name is invalid'});
       }
       else {
          res.send({success:true, user: result});
       }
    } catch(err) {
        res.send({success: false, message: err.message });
    }          
  }

  async function login(req, res, next) {
    try {
      const username = req.body.username;
      const pwd = req.body.password;
      
      const result = await usecase.loginByUsername(username, pwd);
      if (result == 0) {
          res.send({success: false, message: 'User not found with following username.'});
      } else if (result == 1) {
          res.send({success: false, message: 'Authentication failed.'});
      } else {
          //result is user
          res.send({success: true, user: result});
      }
    } catch(error) {
      res.send({success: false, message: err.message });
    }
  }

  return { registerStudent, registerFaculty, login };
}