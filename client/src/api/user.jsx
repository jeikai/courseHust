import Axios from 'axios';
import UserData from '../db/UserData';
import { uploadFile } from '../helpers';
const getUsers = async () => {
    // const res = await Axios.get('../config/users.json')
    // const data = await res.json();
    const data = UserData
    return data;
}

const getUserById = async (id) => {
    // const res = await Axios.post('../config/users.json', id)
    // const data = await res.json();
    const data = UserData[0]
    return data;
}

const createUser = async (data) => {
    // const res = await Axios.post('../config/users.json', data)
    // const data = await res.json();

    // const status = data.status
    if(data.photo instanceof Array) {
        debugger
        let path = uploadFile(data.photo[0].originFileObj)
        debugger
    }
    const status = true
    return status
}


const editUser = async (data) => {
    // const res = await Axios.putch('../config/users.json', data)
    // const data = await res.json();

    // const status = data.status
    const status = true
    return status
}

const deleteUser = async (id) => {
    // const res = await Axios.post('url', id)
    // const data = await res.json();
    
    // trả về status true or false
    return true
}


export { getUsers, getUserById, createUser, editUser, deleteUser }