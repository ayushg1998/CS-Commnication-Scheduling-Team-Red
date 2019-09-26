import axios from 'axios';

export const register = newUser => {
    if(newUser.userType === "student") {
        return axios
            .post('/create/student', {
                cwid: newUser.cwid,
                fname: newUser.fname,
                lname: newUser.lname,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                confirmPassword: newUser.confirmPassword,
                userType: newUser.userType
            })
            .then(res => {
                console.log('Registered');
            })
            .catch(err => {
                console.log(err);
            });
    }
    else if(newUser.userType === "faculty") {
        return axios
            .post('/create/faculty', {
                cwid: newUser.cwid,
                fname: newUser.fname,
                lname: newUser.lname,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                confirmPassword: newUser.confirmPassword,
                userType: newUser.userType
            })
            .then(res => {
                console.log('Registered');
            })
            .catch(err => {
                console.log(err);
            });
    }
  }
  

export const login = user => {
    return axios
        .post('/login', {
            username: user.username,
            password: user.password
        })
        .then(res => {
            console.log("Logged In");
            localStorage.setItem('userToken', res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
        });
}