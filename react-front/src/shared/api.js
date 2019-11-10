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

export function createEvent({ name, description, image, start, end, color, groupId }) {
    return axios
        .post('/events', { name, description, image, start, end, color, groupId }, getAuthHeaders())
        .then(res => res.data)
        .then(res => {
            if (!res.success) throw new Error(res.message);
        });
}

export function getCalendarEvents() {
    return axios
        .get('/calendar-events', getAuthHeaders())
        .then(res => res.data)
        .then(res => {
            if (!res.success) throw new Error(res.message);
            return res.data;
        });
}

export function logout() {
    return Promise.resolve()
        .then(() => {
            localStorage.removeItem('user');
        });
}


export function addAppointmentEvent({name, start, end, slotInterval, description,color}) {
    return axios
    .post('/appointment-event', {name, start, end, slotInterval, description, color}, getAuthHeaders())
    .then(res => res.data)
    .then(res => {
        if (!res.success) throw new Error(res.message);
        return;
    });
}

export function getAppointmentEvent(id){
    return axios
        .get('/appointment-event?appointerId='+id, getAuthHeaders())
        .then(res => res.data)
        .catch(res => {
            if(!res.success) throw new Error(res.message);
            return "Error";
        });
}

export function shareCalendar({userId, permission}) {
    return axios
        .post('/calendar-events/share', {userId, permission}, getAuthHeaders())
        .then(res => res.data)
        .then(res => {
            if(!res.success) throw new Error(res.message);
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

/*
    @return Promise<Array<{
        id: number,
        name: string,
        description: string,
        creatorId: number,
        permission: string
    }>>
*/
export function getAllVisibleGroups() {
    return axios
    .get('/groups/me?filters=all_visible', getAuthHeaders())
    .then(res => res.data)
    .then(res => res.groups)
    .catch(res => {
        if(!res.success) throw new Error(res.message);
    });
}

/*
    @return Promise<Array<{
        id: number,
        name: string,
        description: string,
        creatorId: number,
        permission: string
    }>>
*/
export function getMyCreatedGroups() {
    return axios
    .get('/groups/me', getAuthHeaders())
    .then(res => res.data)
    .then(res => res.groups)
    .catch(res => {
        if(!res.success) throw new Error(res.message);
    });
}

export function addGroupMembers(groupId, cwids) {
    console.log('adding....');
    console.log(groupId);
    console.log(cwids);
    
    const url = `/groups/${groupId}/members`;
    return axios
        .post(url, {cwids}, getAuthHeaders())
        .then(res => res.data)
        .catch(res => {
            if(!res.success) throw new Error(res.message);
        });
}


function getAuthHeaders() {
    const { loginToken: authtoken } = JSON.parse(localStorage.getItem('user'));
    return {
        headers: { 'Content-Type': 'application/json', 'authtoken': authtoken },
    }
}

/*TODO: createEvent, createFaculty and createStudent here*/