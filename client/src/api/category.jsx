import Axios from 'axios';
import CategoryData from '../db/CategoryData';

const getCategories = async () => {
    const data = CategoryData
    return data;
}

export { getCategories }