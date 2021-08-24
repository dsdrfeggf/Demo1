import Vue from 'vue'
import App from './App.vue'
import Router from './router'

// Vue.use(VueRouter)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router:Router
})


// import Vue from "vue"
// import App from "./App"
// import VueRouter from 'vue-router'
// //引入路由器
// import Router from './router/index'

// Vue.use(VueRouter)
// new Vue({
//     el:"#app",
//     render:h=>h(App),
//     router:Router
// })