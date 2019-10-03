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


export function addAppointmentEvent({start, end, slotInterval, description}) {
    return axios
    .post('/appointment-event', {start, end, slotInterval, description}, getAuthHeaders())
    .then(res => res.data)
    .then(res => {
        if (!res.success) throw new Error(res.message);
        return;
    });
}

function getAuthHeaders() {
    const { loginToken: authtoken } = JSON.parse(localStorage.getItem('user'));
    return {
        headers: { 'Content-Type': 'application/json', 'authtoken': authtoken },
    }
}

/*TODO: createEvent, createFaculty and createStudent here*/