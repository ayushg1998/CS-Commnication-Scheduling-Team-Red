const { USERTYPE_FACULTY } = require('../constants');
const { sqlUtils } = require('../lib');

module.exports = function(mysql) {
  function createUser({cwid, username, email, password, fname, lname, loginToken, userType}) {
    const signupOtpVerified = false;
    const query = `INSERT INTO User (cwid, fname, lname, username, email, password, loginToken, signupOtpVerified, userType) 
    VALUES ${sqlUtils.sqlValues([cwid, fname, lname, username, email, password, loginToken, signupOtpVerified, userType])};`
    
    return new Promise(function(resolve, reject){
        mysql.query(query, async function(err) {
            if (err) { reject(err); return; }
            const user = await findUserByCWID(cwid);
            resolve(user);
        });
    });
  }

  //creator id is NULL for solo group of user
  function getSoloGroupOfUser(userId) {
      const query = `SELECT UG.id,UG.name,UG.description,UG.creatorId FROM User_UserGroup UUG 
        JOIN UserGroup UG ON UG.id=UUG.groupId
        WHERE UUG.userId=${userId} AND UG.creatorId IS NULL;`;

        return new Promise(function(resolve, reject){
            mysql.query(query, async function(err, rows) {
                if (err) { reject(err); return; }
                if (!rows.length) { resolve(null); return; }
                resolve(rows[0]);
            });
        });
  }


  
  function getFaculties() {
    return new Promise(function(resolve, reject){
        mysql.query(`SELECT * FROM User WHERE userType='${USERTYPE_FACULTY}'`, function(err, rows){
            if (err) {reject(err);return;}
            if (!rows.length) { resolve(null); return;}
            resolve(rows.map(r => toUserDomain(r)));
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

  function findUserById(id) {
    return new Promise(function(resolve, reject){
        mysql.query(`SELECT * FROM User WHERE id = '${id}'`, function(err, rows){
            if (err) {reject(err); return;}
            if (!rows.length) { resolve(null); return;}//user with username not found
            resolve(toUserDomain(rows[0]));
        });
    });
  }

  function findUserByLoginToken(loginToken) {
    return new Promise(function(resolve, reject){
        mysql.query(`SELECT * FROM User WHERE loginToken = '${loginToken}'`, function(err, rows){
            if (err) {reject(err); return;}
            if (!rows.length) { resolve(null); return;}//user with username not found
            resolve(toUserDomain(rows[0]));
        });
    });
  }

  return {
    createUser,
    findUserByCWID,
    findUserByUsername,
    findUserById,
    findUserByLoginToken,
    getFaculties,
    getSoloGroupOfUser
  };  
};

function toUserDomain(row) {
  return {
      id: row.id,
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
