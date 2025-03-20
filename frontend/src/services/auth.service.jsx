import axios from "axios";
const API_URL = "http://localhost:4000/api";

const signup = ({firstname, lastname, email, username, password})=> {
    return axios.post(`${API_URL}/signup`,{
        firstname,
        lastname,
        username,
        password,
        email
    });
}

const login = ({emailOrUsername, password})=> {
    return axios.post(`${API_URL}/login`, {
        emailOrUsername,
        password
    }).then((res)=> {

        localStorage.setItem('user', JSON.stringify(res.data));
        console.log(res);
        return res.data;
    })
}

const logout = ()=> {
    localStorage.removeItem('user');
}

const getCurrentUser = ()=> {
    return JSON.parse(localStorage.getItem('user'));
}

export default {
    signup,
    login,
    logout,
    getCurrentUser
}