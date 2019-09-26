import axios from 'axios';

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