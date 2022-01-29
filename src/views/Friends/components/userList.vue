<template>
  <div class="userlist">
    <div class="nav">
      <div class="headerimg online">
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
import socket from "../js/socket";
export default {
  data() {
    return {
      islogin: false,
      users: [],
      unreadlist: [],
      ischat: false,
      touser: null,
    };
  },
  methods: {
    chooseuser(user) {
      console.log("点击了chooseuser事件");
      this.touser = user;
      this.ischat = true;
      let index = this.unreadlist.indexOf(user.username);
      this.unreadlist.splice(index, 1);
      this.$router.push({
        path: "/chatuser",
        query: { touser: this.touser, users: this.users,unreadlist:this.unreadlist},
      });
    },
  },
  computed: {
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
    // this.islogin=this.$route.query.islogin
    this.users = this.$route.query.users;
    this.unreadlist = this.$route.query.unreadlist;

    console.log(this.$route.query.users);
    console.log(this.$route.query.unreadlist);
    // this.unreadlist=this.$route.query.unreadlist
  },
  mounted() {
    // 监听登录成功设置为true
    socket.on("login", (data) => {
      if (data.state == "ok") {
        this.islogin = true;
        socket.emit("users");
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

    // 2
  },

  watch: {
    users: function (val, oldVal) {
      // this.users = val
      console.log(val, oldVal);
      // this.friends()
    },
  },
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