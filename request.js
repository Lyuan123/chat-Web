import axios from 'axios'
// axios.defaults.withCredentials=true
const service=axios.create({

    baseURL:'http://localhost:3000',
    // baseURL:'http://192.168.123.127:3000',

    //配置请求超时时间
    timeout: 5000
})

export default service