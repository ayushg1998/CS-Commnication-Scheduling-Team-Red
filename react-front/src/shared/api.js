import axios from 'axios';
//import moment from 'moment';

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

export function getAppointmentEvent(){
    return axios
    .get('/appointment-event?appointerId=1', getAuthHeaders())
    .then(res => res.data)
    .catch(res => {
        if(!res.success) throw new Error(res.message);
        return "Error";
    });
}

export function getFaculty() {
    return axios
    .get('/user/faculty', getAuthHeaders())
    .then(res => res.data)
    .catch(res => {
        if(!res.success) throw new Error(res.message);
        return "Error";
    });
}

function getAuthHeaders() {
    const { loginToken: authtoken } = JSON.parse(localStorage.getItem('user'));
    return {
        headers: { 'Content-Type': 'application/json', 'authtoken': authtoken },
    }
}

/*TODO: createEvent, createFaculty and createStudent here*/