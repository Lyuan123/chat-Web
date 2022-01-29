<template>
  <div class="userlist">
    <div class="nav">
      <div class="headerimg" :class="{ online: islogin }">
        <img v-if="$root.me != null" :src="$root.me.headerimg" alt="" />
      </div>
      <div class="title">消 息</div>
      <div style="height: 60px; width: 60px"></div>
    </div>
    <div class="users">
      <div
        @click="chooseuser(item)"
        class="useritem"
        v-for="(item, index) in friends"
        :key="index"
      >
        <div
          class="left"
          :class="{
            online: item.isonline == 'true',
            unread: unreadlist.indexOf(item.username) != -1,
          }"
        >
          <img :src="item.headerimg" alt="" />
        </div>
        <div class="right">
          <span class="username">{{ item.username }}</span>
          <span class="msg"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import socket from './js/socket'
import { reqCurrentUser } from "../../../api/getData";
import { mapState } from "vuex";
import axios from "axios";
export default {
  data() {
    return {
        // 用户自己信息
      userinfo: {},
      mehead_img: "",
      mename: "",
      


       islogin:false,
      users:[],
      unreadlist:[],
      ischat:false,
      touser:null,
 
        };
  },
  methods: {
       async creat() {
      //获取用户信息

      const result = await reqCurrentUser(this.current_user_id,this.token);
      console.log(result);
      if (result.data.code === 0) {
          this.info = result.data.data
           this.userinfo = result.data.data;

        this.mehead_img = result.data.data.headerimg;
        this.mename = result.data.data.username;
        //  location.reload();
      }

      var _this = this;
      await axios.all([
        axios.get("http://localhost:3000/api/me", {
          params: {
            mehead_img: this.mehead_img,
            mename: this.mename,
          },
        }),
        axios
          .get("http://localhost:3000/api/userlist", {
            params: {
              mename: _this.mename,
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
           console.log("获取用户数据");
      this.$root.me = this.userlist[0];
      console.log(this.$root.me);
      localStorage.chatme = JSON.stringify(this.userlist[0]);
      socket.emit("login", this.userlist[0]);
      console.log(this.islogin, this.users, this.unreadlist);
    //   setTimeout(() => {
    //     this.$router.push({
    //       path: "/userlist",
    //       query: { users: this.users },
    //     });
    //   }, 100);
    },
    chooseuser() {
      console.log("点击了chooseuser事件");
      this.touser = user;
      this.ischat = true;
      let index = this.unreadlist.indexOf(user.username)
      this.unreadlist.splice(index,1)
      this.$router.push({path:'/chatuser',query: { touser:this.touser,users:this.users}})
    },
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
    friends() {
      if (this.$root.me == null) {
        return [];
      } else {
        let username = this.$root.me.username;
        console.log(username);
        console.log(this.users);
        return this.users.filter((item) => {
          return item.username != username;
        });
      }
    },
   
  },
  created() {
    //   this.choosechat()
    // // this.islogin=this.$route.query.islogin
    // this.users=this.$route.query.users

    // console.log(this.$route.query.users);
    // // this.unreadlist=this.$route.query.unreadlist

  },
  mounted() {
      
       this.creat();
       setTimeout(() => {
            this.choosechat()
       }, 100);
       
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
      // console.log(this.users);
    });
          // 监听登录成功设置为true
    socket.on("login", (data) => {
      if (data.state == "ok") {
        this.islogin = true;
        socket.emit('users')
        console.log("登录成功", this.islogin);
      } else {
        console.log("登录失败");
      }
    });
        // 监听登出事件
    socket.on("logout", (data) => {
      console.log(data);
      this.islogin = false;
      // 断开连接
      alert(data.content);
      this.$router.push({ path: "/personal" });
      socket.disconnect();
    });
        // 监听断开连接事件
    socket.on("disconnect", () => {
      console.log("断开连接");
    });

    // 2
    socket.on("unreadMsg", (data) => {
      console.log(data);
      // data.forEach((item,index)=>{
      data.forEach((item) => {
        // 设置未读的红点
        // 将聊天的内容分添加到本地的存储
        // 将from/to改成有头像的对象
        item.from = this.usersObj[item.fromuser];
        item.to = this.usersObj[item.touser];
        this.unreadlist.push(item.fromuser);

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
    // 2
  },
  
  watch:{
    users:function (val,oldVal) {
      // this.users = val
      console.log(val,oldVal);
      // this.friends()
    }
  }
  
};
</script>

<style scoped>
.unread {
  position: relative;
}
.unread::before {
  position: absolute;
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background: red;
  bottom: 5px;
  right: 5px;
}
.useritem .left {
  filter: grayscale(1);
}
.right {
  padding: 0 10px;
}
.useritem {
  display: flex;
  height: 80px;
  background: #eee;
  border-bottom: 1px solid #ccc;
  align-items: center;
  padding: 0 10px;
}
.useritem .left img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.headerimg {
  filter: grayscale(1);
  margin-left: 10px;
}
.online {
  filter: grayscale(0) !important;
}
.nav {
  height: 80px;
  width: 100vw;
  background: skyblue;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.headerimg img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
.nav .title {
  font-weight: 900;
  font-size: 18px;
}
</style>