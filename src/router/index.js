import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home/Home.vue'),
    meta:{isRequireFooter:true,requiresAuth:true},
  },
  {
    path: '/more',
    name: 'More',
    component: () => import('../views/More/More.vue'),
    meta:{isRequireFooter:true,requiresAuth:true}
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import('../views/Publish/Publish'),
    meta:{isRequireFooter:true,requiresAuth:true}
  },
  
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register/Register.vue')
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('../views/Friends/Friends.vue'),
    meta:{isRequireFooter:true,requiresAuth:true},
  },
  // {
  //   path:'/chat/:id/:username',
  //   meta:{isRequireFooter:false,requiresAuth:true},
  //   component:()=>import('../views/Friends/child/Chat.vue'),
  // },
  {
    path: '/mine',
    name: 'Mine',
    component: () => import('../views/Mine/Mine.vue'),
    meta:{isRequireFooter:true,requiresAuth:true},
  },
  {
    path:'/edit',
    name:'Edit',
    component:()=>import('../views/Edit/Edit'),
    meta:{isRequireFooter:false,requiresAuth:true},
  },
  {
    path:'/chatuser',
    name:'chatuser',
    component:()=>import('../views/Friends/components/chatUser'),
    meta:{isRequireFooter:false,requiresAuth:true},
  },
  {
    path:'/userlist',
    name:'chatuser',
    component:()=>import('../views/Friends/components/userList'),
    meta:{isRequireFooter:false,requiresAuth:true},
  }
]

const router = new VueRouter({
  routes
})


export default router
