const LocalStrategy = require("passport-local").Strategy;

const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const dbconfig = require('./database');

const connection = mysql.createConnection(dbconfig.connection);
connection.connect(function(error) {
    if (error) throw error;
    
    console.log('connected to db');
    
    connection.query('USE calendar');
})  


module.exports = function(passport){
    passport.serializeUser(function(login,done){
        done(null,login.id);
    });

    passport.deserializeUser(function(id, done){
        connection.query("SELECT * FROM login WHERE id = ? ", [id],
         function(err, rows){
          done(err, rows[0]);
         });
    });
    
    passport.use('local-signup',
    new LocalStrategy({
        usernameField : 'username',
        passwordField: 'password',
        passReqToCallback: true
    },function(req, username, password, done){
        connection.query("SELECT * FROM login WHERE username = ? ", 
        [username], function(err, rows){
            if(err)
            return done(err);
            if(rows.length){
            return done(null, false, req.flash('signupMessage', 'The email address is already in use.'));
            }else{
            var newUserMysql = {
            username: username,
            password:  bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            };
        
            var insertQuery = "INSERT INTO login (username, password) values (?, ?)";
        
            connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
            function(err, rows){
            newUserMysql.id = rows.insertId;
        
            return done(null, newUserMysql);
            });
            }
        });
    
    
    }));
         
    passport.use('local-login',
    new LocalStrategy({
        usernameField : 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done){
        connection.query("SELECT * FROM login WHERE username = ? ", [username],
        function(err, rows){
            if(err)
            return done(err);
            if(!rows.length){
            return done(null, false, req.flash('loginMessage', 'No User Found'));
            }
            if(!bcrypt.compareSync(password, rows[0].password))
            return done(null, false, req.flash('loginMessage', 'Wrong Password'));
        
            return done(null, rows[0]);
        });
    }));
};