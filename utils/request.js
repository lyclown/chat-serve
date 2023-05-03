import axios from "axios";
import HttpsProxyAgent from "https-proxy-agent";
const httpsAgent = new HttpsProxyAgent(`http://127.0.0.1:9981`);
// 创建axios实例
const instance = axios.create({
    timeout: 100000,
    proxy: false,
    httpsAgent,
    headers:{
        Authorization:'Bearer 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',
    }
});
// 请求拦截器
instance.interceptors.request.use(config => {
    // 处理Loading状态
    // ...

    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(response => {
    // 处理Loading状态
    // ...

    // 统一处理响应数据
    return response.data;
}, error => {
    // 处理Loading状态
    // ...

    // 统一处理错误信息
    if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else {
        // 请求未发出，网络异常等原因
        console.log('Error', error.message);
    }

    return Promise.reject(error);
});

export default instance;
