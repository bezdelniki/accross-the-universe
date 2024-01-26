import axios from 'axios';

function createClient() {
    const token = sessionStorage.getItem('token');

    const client = axios.create({
        baseURL: 'http://127.0.0.1:8000/api',
        headers: {
            'Authorization': token ? `Token ${token}` : null,
        },
    });

    return client;
}

export default createClient;