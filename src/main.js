import Vue from 'vue'
import App from './App.vue'
import Router from './router'
import store from './store'
import Vuelazyload from 'vue-lazyload'
//引入mint-ui的Button组件
import {Button} from 'mint-ui'

import './mock/mockServer' //加载mockServer即可使用
import './filters/index'
import loading from './common/img/loading.c1486d8.gif'

//注册全局组件标签
Vue.component(Button.name,Button)

Vue.use(Vuelazyload,{//内部自定义一个指令lazy
  loading
})

// Vue.use(VueRouter)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router:Router,
  store
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