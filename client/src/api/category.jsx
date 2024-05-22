import Axios from 'axios';
import CategoryData from '../db/CategoryData';
import { useAPI } from '../hooks/api';

const getCategories = async () => {
    const categoryAPI = await useAPI('/api/category', null).data;
    const data = CategoryData
    return categoryAPI;
}

export { getCategories } 