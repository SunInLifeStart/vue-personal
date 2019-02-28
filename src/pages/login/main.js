import Vue from 'vue'
import App from './App.vue'
import 'babel-polyfill'
import store from '@/store'
import '@/scss/element-variables.scss'
import '@/plugins/element.js'
import '@/assets/normalize.css'
import '@/assets/animate.css'
import '@/assets/font/iconfont.css'

new Vue({
  store,
  render: h => h(App)
}).$mount('#login')
