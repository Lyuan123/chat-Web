import axios from '../request'
import asd from 'axios'

//注册接口
export const reqRegister = (username, password, email) => axios.post("/register", {
  "username": username,
  "password": password,
  "email": email,
})
//登录接口
export const reqLogin = (username, password) => axios.post("/login", {
  "username": username,
  "password": password,
})
// 获取用户信息
export const reqCurrentUser = (current_id, token) => axios.get("/currentUser", {
  params: {
    "current_id": current_id
  },
  headers: {
    token: token
  }
})
// 上传头像,
export function reqUploadImg(file, current_id) {
  return axios({
    url: '/uploadImg',
    method: 'POST',
    Headers: {
      "content-type": "multipart/form-data",
    },
    data: file,
    params: { current_id }
  })
}
// 修改用户信息
export const updateUserInfo = (username, password, email, current_id) => axios.post("/updateUserInfo", {
  data: {
    username, password, email
  },
  params: { current_id }
})
// 查找所有的动态
export const findAllDynamic = () => axios.get("/allDynamic")

// 评论动态接口
export const dynamic_remark = (remark_username, dynamic_id, remark_content) => axios.post("/remark", {
  data: {
    remark_username,
    dynamic_id,
    remark_content
  }
})

// 查找所有的评论
export const findAllRemark = (dynamic_id) => axios.get("/allRemark",{
  params:{
    dynamic_id
  }
})
// 发布动态
export function publishDynamic(file,user){
  return axios({
    url:'/publish',
    method:'POST',
    data:file,
    Headers:{
      "content-type": "multipart/form-data",
    },
    params:user
  })
}