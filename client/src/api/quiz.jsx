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

export { getQuizs, deleteQuiZ }