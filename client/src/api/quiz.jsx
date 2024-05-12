import Axios from 'axios';
import QuizData from '../db/QuizData';
const getQuizs = async () => {
    const data = QuizData
    return data;
}

const deleteQuiZ = async (id) => {
    // const res = await Axios.post('url', id)
    // const data = await res.json();
    
    // trả về status true or false
    return true
}

const createQuiz = async (data) => {
    // const res = await Axios.post('url', data)
    // const data = await res.json();

    return true
}

const getQuizById = async (id) => {
    // const res = await Axios.post('../config/users.json', id)
    // const data = await res.json();
    const responseAPI = await Axios({url: `/api/quiz/${id}`, method: "GET"})
    const data = responseAPI.data.data
    return data;
}

export { getQuizs, deleteQuiZ, createQuiz, getQuizById }