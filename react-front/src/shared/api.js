import axios from 'axios';

export function login({username, password}) {
    return axios
        .post('/login', {username, password})
        .then(res => res.data)
        .then(res => {
            if (!res.success) throw new Error(res.message);
            return res.user;
        });
}

export function logout() {
    return Promise.resolve()
        .then(() => {
            localStorage.removeItem('user');
        });
}

/*TODO: createEvent, createFaculty and createStudent here*/