import axios from 'axios';

export const login = ({username, password}) => {
    return axios
        .post('/login', {username, password})
        .then(res => res.data)
        .then(res => {
            if (!res.success) throw new Error(res.message);
            const user = res.user;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        })
        .catch(err => {
            console.log(err);
        });
}

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

export const getUser = () => {
    return isAuthenticated()? JSON.parse(localStorage.getItem('user')): null;
}

export const isAuthenticated = () => {
    return !!localStorage.getItem('user');
}

export const logout = () => {
    localStorage.removeItem('user');
}

export const createEvent = (eventData) => {
    return axios
        .post('/create/event', eventData)
        .then(res => res.data)
        .then(res => {
            if (!res.success) throw new Error(res.message);
            return res.data;
        })
        .catch(err => {
            console.log(err);
        });
}
