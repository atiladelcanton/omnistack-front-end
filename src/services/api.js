import axios from 'axios';

const api = axios.create({
    baseURL: 'https://oministack-atila.herokuapp.com',
});

export default api;