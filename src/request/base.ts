import axios from 'axios';
import { message } from "antd";

const axiosInstance = axios.create({
    baseURL: './',
    timeout: 10000, // 超时时间
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    const aid = localStorage.getItem("aid");
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    if (aid) {
        if (config.url && config.url.includes("{aid}")) {
            config.url = config.url.replace("{aid}", aid)
        }
    }
    return config;
}, error => {
    console.log("request error", error)
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status == 401) {
        message.error("令牌失效，请重新登录")
        setTimeout(()=>{
            window.location.href = "./#/login"
        }, 500)
    }
    return Promise.reject(error);
});
export default axiosInstance;