module.exports = function(mysql) {
  function createUser({cwid, username, email, password, fname, lname, loginToken, userType}) {
    return new Promise(function(resolve, reject){
        const signupOtpVerified = false;
        const queryString = `INSERT INTO User (cwid, fname, lname, username, email, password, loginToken, signupOtpVerified, userType) VALUES ('${cwid}','${fname}','${lname}','${username}','${email}','${password}','${loginToken}',${signupOtpVerified},'${userType}');`
        mysql.query(queryString, async function(err) {
            if (err) { reject(err); return; }
            const user = await userRepository.findUserByCWID(cwid);
            resolve(user);
        });
    });
  }
  
  function findUserByCWID(cwid) {
    return new Promise(function(resolve, reject){
        mysql.query(`SELECT * FROM User WHERE cwid='${cwid}'`, function(err, rows){
            if (err) {reject(err);return;}
            if (!rows.length) { resolve(null); return;}//user with cwid not found
            resolve(toUserDomain(rows[0]));
        });
    });
  }
  
  function findUserByUsername(username) {
    return new Promise(function(resolve, reject){
        mysql.query(`SELECT * FROM User WHERE username = '${username}'`, function(err, rows){
            if (err) {reject(err); return;}
            if (!rows.length) { resolve(null); return;}//user with username not found
            resolve(toUserDomain(rows[0]));
        });
    });
  }

  return {
    createUser,
    findUserByCWID,
    findUserByUsername
  };  
};

function toUserDomain(row) {
  return {
      cwid: row.cwid,
      fname: row.fname,
      lname: row.lname,
      username: row.username,
      email: row.email,
      password: row.password,
      loginToken: row.loginToken,
      userType: row.userType,
      emailVerified: !!row.signupOtpVerified
  }
}
