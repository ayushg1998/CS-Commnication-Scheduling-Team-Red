const assert = require('assert');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 8080;
<<<<<<< HEAD
const cors = require('cors');
=======
>>>>>>> 8327e1236a7ded42e2fa69053b3f5a07a65f97b6

//HTTP: application/json Content-type headers are automatically made available in req.body
app.use(bodyParser.json());

//logs incoming request if process.env.NODE_ENV !== 'production'(i think)
app.use(morgan('dev'));

//cookie parsing from headers, and available in req.headers.cookie (or req.headers.cookies forgot exact)
app.use(cookieParser());

<<<<<<< HEAD
//app.use(cors());
=======
>>>>>>> 8327e1236a7ded42e2fa69053b3f5a07a65f97b6

// var passport = require('passport');
// var flash = require('connect-flash');

// require('./config/passport')(passport);



// app.set('view engine', 'ejs');

// app.use(session({
//  secret: 'justasecret',
//  resave:true,
//  saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// require('./app/route')(app, passport);

//this process is assigned a LISTEN SOCKET and incoming requests with
//matching PORT is notified as event to the socket object abstraction.
//express is built on top of http core module which is built on top of 
//socket module
app.listen(port, function() {
    console.log("Port: " + port);

    const mysql = require('mysql');
    const dbconfig = require('./config/database');

    //sql connection builder object, but not connected until
    //connection.connect (see builder pattern)
    const connection = mysql.createConnection(dbconfig.connection);

    //sql TCP connection
    connection.connect(function(error) {
        if (error) throw error;
        
        console.log('connected to db');
        connection.query('USE calendar');

        //dependency graph:
        //repository depends on mysql connection
        //usecase depends on repository
        //express route handlers depend on usecase/repository
        //we can seperate controller into different file, and abstract 
        //that as well. this is good for now though
        const repository = require('./repository')(connection);
        const loginUsecase = require('./loginUsecase')(repository);
<<<<<<< HEAD
        
=======

>>>>>>> 8327e1236a7ded42e2fa69053b3f5a07a65f97b6
        app.post('/login', async function(req, res, next) {
            const username = req.body.username;
            const pwd = req.body.password;
            
            const result = await loginUsecase.loginByUsername(username, pwd);
            if (result == 0) {
                res.send({success: false, message: 'User not found with following username.'});
            } else if (result == 1) {
                res.send({success: false, message: 'Authentication failed.'});
            } else {
                //result is user
                res.send({success: true, user: result});
            }
        });

        /*body
            {username: 'name'}
        */
        app.post('/request-password-change', async function(req, res, next) {
            try {
                const username = req.body.username; assert.ok(username);
                await loginUsecase.requestPasswordUpdate(username);
                res.send({success: true}); 
            } catch(err) {
                res.send({success: false, message: err.message });
            }
        });

        /*body
            {otp: '33333', username: 'name'}
        */
        app.post('/verify-password-change', async function(req, res, next) {
            try {
                const username = req.body.username; const otp = req.body.otp;
                assert.ok(username); assert.ok(otp);
                const isOk = await loginUsecase.verifyPasswordOtp(username, otp);
                res.send({success: true, otpVerified: isOk});
            } catch(err) {
                res.send({success: false, message: err.message });
            }
        });

        /*body
            {otp: '33333', username: 'name', password: 'newpassword'}
        */
        app.post('/change-password', async function(req, res, next) {
            try {
                const pwd = req.body.password; const username = req.body.username; const otp = req.body.otp;
                assert.ok(username); assert.ok(otp); assert.ok(pwd);
    
                const isOtpGood = await loginUsecase.verifyPasswordOtp(username, otp);
                if (!isOtpGood) return res.send({success: false, message: 'Otp did not match'});
    
                await loginUsecase.updatePassword(username, pwd);
                res.send({success: true});
            } catch(err) {
                res.send({success: false, message: err.message });
            }
        });

        app.post('/create/faculty', async function(req, res, next) {
            try {
                const cwid = req.body.cwid;
                const username = req.body.username;
                const email = req.body.email;
                const password = req.body.password;
                const fname = req.body.fname;
                const lname = req.body.lname;
    
                const result = await loginUsecase.createFaculty({cwid, username, email, password, fname, lname});
    
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
        });

        app.post('/create/student', async function(req, res, next) {
            try {
                const cwid = req.body.cwid;
                const username = req.body.username;
                const email = req.body.email;
                const password = req.body.password;
                const fname = req.body.fname;
                const lname = req.body.lname;
    
                const result = await loginUsecase.createStudent({cwid, username, email, password, fname, lname});
    
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
        })

<<<<<<< HEAD
        
=======
        app.get('/hello-world', function(req, res, next) {
            res.send({success: true, data: 'hello world'});
        })
>>>>>>> 8327e1236a7ded42e2fa69053b3f5a07a65f97b6
    });    
});


