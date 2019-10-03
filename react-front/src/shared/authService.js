import * as api from './api';
import axios from 'axios';

export const register = newUser => {
    if(newUser.userType === "student") {

        //TODO: these api calls should be housed inside api.js file
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
                const user = res.user;
                localStorage.setItem('user', JSON.stringify(user));
                emitAuthStatusChangeListener();
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
                const user = res.user;
                localStorage.setItem('user', JSON.stringify(user));
                emitAuthStatusChangeListener();
            })
            .catch(err => {
                console.log(err);
            });
    }
}

export function login({username, password}) {
    return api.login({username, password})
        .then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            emitAuthStatusChangeListener();
        });
}

export function logout() {
    return api.logout()
        .then(() => {
            emitAuthStatusChangeListener();
        })
}

const listeners = new Set();
export function registerAuthStatusChangeListener(fn) {
    checkFunction(fn);
    listeners.add(fn);
}

export function unregisterAuthStatusChangeListener(fn) {
    checkFunction(fn);
    listeners.delete(fn);
}

export function isAuthenticated() {
    return !!localStorage.getItem('user');
}

export function getAuthToken() {
    const { loginToken } = JSON.parse(localStorage.getItem('user'));
    return loginToken;
}

function emitAuthStatusChangeListener() {
    listeners.forEach(fn => { fn(); });
}

function checkFunction(fn) {
    if (typeof fn !== 'function') throw new Error('function parameter expected');
}