import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8000/api/', // Django 서버 URL
    headers: {
        'Content-Type': 'application/json',
    },
})

export default instance
