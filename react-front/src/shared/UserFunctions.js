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

export const getUser = () => {
    return isAuthenticated()? JSON.parse(localStorage.getItem('user')): null;
}

export const isAuthenticated = () => {
    return !!localStorage.getItem('user');
}

export const logout = () => {
    localStorage.removeItem('user');
}