<template>
  <div>
    <div @click="choosechat()" style="display: block">进入聊天</div>
  </div>
</template>

<script>
import socket from "./js/socket";
import { reqCurrentUser } from "../../../api/getData";
import { mapState } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
      // 2
      // 用户自己信息
      userinfo: {},
      mehead_img: "",
      mename: "",
      users:[],

      userlist: [],
      islogin: false,

      ischat: false,
      touser: null,
      unreadlist: [],
    };
  },

  mounted() {
    this.creat();
    // 监听登录成功设置为true
    socket.on("login", (data) => {
      if (data.state == "ok") {
        this.islogin = true;
        console.log("登录成功", this.islogin);
      } else {
        console.log("登录失败");
      }
    });
    // 重新查询users的用户列表用于更新状态
    socket.on("users", (data) => {
      console.log(data);
      this.users = data;
      console.log(this.users);
    });
      socket.on("unreadMsg", (data) => {
      console.log(data);
      // data.forEach((item,index)=>{
      data.forEach((item) => {
        // 设置未读的红点
        // 将聊天的内容分添加到本地的存储
        // 将from/to改成有头像的对象
        console.log(item.fromuser,item.touser);
        item.from = this.usersObj[item.fromuser];
        item.to = this.usersObj[item.touser];
        this.unreadlist.push(item.fromuser);
        console.log(this.unreadlist);

        let strKey =
          "chat-user-" + this.$root.me.username + "-" + item.from.username;
        //  先解析本地存储的数据，再添加
        localStorage[strKey] = localStorage[strKey]
          ? localStorage[strKey]
          : "[]";
        let newArr = JSON.parse(localStorage[strKey]);
        newArr.push(item);
        localStorage[strKey] = JSON.stringify(newArr);
        // console.log(this.usersObj);
      });
    });
  },
  computed: {
    ...mapState(["current_user_id", "token"]),
     // 获取未读消息
    usersObj() {
      let obj = {};
      console.log(this.users);
      this.users.forEach((item) => {
        obj[item.username] = item;
      });
      console.log(obj);
      return obj;
    },
  },
  methods: {
    //是否新增用户
    async creat() {
      //获取用户信息

      const result = await reqCurrentUser(this.current_user_id, this.token);
      console.log(result);
      if (result.data.code === 0) {
        this.info = result.data.data;
        this.userinfo = result.data.data;

        this.mehead_img = result.data.data.headerimg;
        this.mename = result.data.data.username;
        //  location.reload();
      }

      var _this = this;
      await axios.all([
        axios.get("http://localhost:4000/api/me", {
          params: {
            mehead_img: this.mehead_img,
            mename: this.mename,
          },
        }),
        axios
          .get("http://localhost:4000/api/userlist", {
            params: {
              mename: _this.mename
            },
          })
          .then((res) => {
            this.userlist = res.data;
            // callback(this.mehead_img,this.mename);
            console.log(this.userlist);
          }),
      ]);
    },

    choosechat() {
      this.$root.me = this.userlist[0];
      console.log(this.$root.me);
      localStorage.chatme = JSON.stringify(this.userlist[0]);
      socket.emit("login", this.userlist[0]);
      console.log(this.islogin, this.users, this.unreadlist);
      setTimeout(() => {
        this.$router.push({
          path: "/userlist",
          query: { users: this.users ,unreadlist:this.unreadlist},
        });
      }, 100);
    },
  },
};
</script>

<style>
</style>