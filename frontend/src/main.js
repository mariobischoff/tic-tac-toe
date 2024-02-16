import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/index.css'

import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

const socket = io('https://tic-tac-toe-backend-p3rw.onrender.com')
// const socket = io('localhost:3333')

Vue.use(VueSocketIOExt, socket)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
