<template>
  <div class="chatuser">
      <div class="header">
          <span class="back" @click="backchat" >&lt; </span>
          <div > {{touser.username}}</div>
         
      </div>
      <div class="chatlist" ref="chatbox">
          <div class="chatItem" v-for="(item,index) in chatlist" :key="index" :class="{self:$root.me.username==item.from.username}">
              <div class="header">
                  <img :src="item.from.headerimg" alt="">
              </div>
              <div class="chatContent">
                  {{item.content}}
              </div>
          </div>
      </div>
      <div class="inputcom">
          <input type="text" v-model="inputData" @keydown.enter="sendEvent">
          <button @click="sendEvent">发送</button>
      </div>
  </div>
</template>

<script>
import socket from '../js/socket'
export default {
    // props:['touser','closeChat','newsMsg'],
    data() {
        return {
            users:[],
            chatlist: [],
            inputData:'',
            newsMsg:null,
            touser:null,
            unreadlist:[]
        };
    },
    methods:{
        backchat(){
            this.$router.replace({path:'/userlist',query:{users:this.users,unreadlist:this.unreadlist}})
        },
        sendEvent(){
           let msg ={
                from:this.$root.me,
                to:this.touser,
                content:this.inputData,
                time:new Date().getTime()
            }
            // 发送到服务端
            socket.emit('sendMsg',msg)
            this.chatlist.push(msg)
            // 保存聊天记录到本地
           this.saveStorage()
           this.toBottom()
        },
        saveStorage(){
             let strKey='chat-user-'+this.$root.me.username+'-'+this.touser.username
            localStorage[strKey] =JSON.stringify(this.chatlist) 
        },
        getStorage(){
            // this.toBottom()
            
             console.log("wozhicasd");
                   socket.emit('readMsg',{
              self:this.$root.me.username,
              username:this.touser.username
          })
          console.log(this.$root.me.username,this.touser.username);
             let strKey='chat-user-'+this.$root.me.username+'-'+this.touser.username
               localStorage[strKey] = localStorage[strKey]?localStorage[strKey]:'[]'
             this.chatlist =JSON.parse(localStorage[strKey]) 
             console.log(this.chatlist);
             console.log("wozhicasd");
        },
        toBottom(){
              let chatbox = this.$refs.chatbox
        chatbox.scrollTop = chatbox.scrollHeight - chatbox.clientHeight;
        }
    },
    watch:{
        newsMsg:function(val){
            this.chatlist.push(val)
            this.saveStorage()

        }
    },
    updated() {
        this.toBottom()
    },
    mounted() {
         socket.on('accept',(msg)=>{
      console.log("接收的数据",msg);
      // ischat正在聊天
      if(( msg.from.username==this.touser.username )|| (msg.to.username==this.touser.username&&msg.to.isgroup=='true')){
        console.log(":进入循环了");
        this.newsMsg = msg
      }else{
        
           let strKey='chat-user-'+this.$root.me.username+'-'+msg.from.username;
          //  先解析本地存储的数据，再添加
          console.log(strKey)
          localStorage[strKey] = localStorage[strKey]?localStorage[strKey]:'[]'
          let newArr = JSON.parse(localStorage[strKey])
          newArr.push(msg)
           localStorage[strKey] = JSON.stringify(newArr) 
           this.unreadlist.push(msg.from.username)
      }
    })
    },
    
   
    // mounted() {
    //   this.toBottom()
    // },
    
  
    created() {
         this.touser=this.$route.query.touser
         this.users=this.$route.query.users
        console.log(this.touser);
          this.getStorage()
          console.log("本地获取成功");

        //           socket.emit('readMsg',{
        //       self:this.$root.me.username,
        //       username:this.touser.username
        //   })
          console.log(this.$root.me.username,this.touser.username);
    },
    
    
    
    
}
</script>

<style scoped>
    .chatItem{
        display: flex;
        margin: 5px 10px;
    }
    .chatItem.self{
        width: 90%;
        justify-content: flex-start;
        flex-direction: row-reverse;
        margin-right: 10px;
    }
    .chatItem .header img{
        width: 55px;
        height: 55px;
        border-radius: 50%;
    }
    .chatItem .chatContent{
        background: #bbb;
        border-radius: 5px;
        padding: 10px 10px;
        color: #fff;
        margin: 0 0px 0 10px;
        line-height: 28px;
        position: relative;
    }
    .chatItem.self .chatContent{
         margin: 0 20px 0 0px;
    }
    .chatItem .chatContent::before{
        display:block;
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-right: 10px solid #bbb;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        top: 20px;
        left: -10px;
    }
    .chatItem.self .chatContent::before{
        display:block;
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-left: 10px solid #bbb;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        top: 20px;
        right: -10px;
         left: initial;
         border-right: initial;

    }
    .chatuser{
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        position: fixed;
        top:0;
        left: 0;
        background: #efefef;
    }
    .chatuser > .header{
        font-size: 18px;
        font-weight: 900;
        background: skyblue;
        height: 40px;
        line-height:40px ;
        text-align: center;
    }
    .chatlist{
        flex: 1;
        overflow: scroll;
    }
    .inputcom{
        height: 50px;
        display: flex;
        background: #eee;
        justify-content: space-between;
    }
    .inputcom input{
        width: 310px;
        height: 40px;
        font-size: 16px;
        border-radius: 5px;
        outline: none;
        border: 1px solid #ccc;
        margin: 0 15px;
    }
    .inputcom button{
        width: 80px;
        height: 40px;
        border-radius: 5px;
        outline: none;
        border: 1px solid #ccc;
    }
    .header{
        position: relative;
    }
    .back{
        display:block;
        width:40px;
        height:40px;
        line-height:40px;
        text-align: center;
        position: absolute;
        left: 0;
        top: 0;
    }
</style>