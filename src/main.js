import Vue from 'vue'
import App from './App.vue'
import 'babel-polyfill'
import 'es6-promise/auto'
import router from './router/router'
import store from './store'
import moment from 'moment'
import common from './plugins/common.js'
import Print from './plugins/print.js'
import './assets/animate.css'
import './assets/normalize.css'
import './scss/element-variables.scss'
import './assets/font/iconfont.css'
import './scss/reset.scss'
import './plugins/element.js'
import './plugins/axios.js'
import './plugins/print.js'
import splitPane from 'vue-splitpane'
import Cookies from 'js-cookie'
// import VueSocketio from 'vue-socket.io'
import axios from 'axios'
Vue.component('split-pane', splitPane);
Vue.use(Print);
Vue.prototype.common = common;

Vue.config.productionTip = false;
moment.locale('zh-cn');
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (dataStr) {
    return moment(dataStr).format(pattern);
  } else {
    return '';
  }
  // return moment(dataStr).format(pattern);
});
Vue.filter('dateFromNow', function (dataStr) {
  return moment(dataStr).fromNow();
});
// if (process.env.NODE_ENV === 'production') {
//   Vue.use(VueSocketio, 'http://172.16.3.17');
// } else {
//   Vue.use(VueSocketio, 'http://59.110.172.228:10988');
// }

const whiteList = ['/login']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  console.log(Cookies.get('uid'));
  document.title = to.name ? to.name : '';
  if (store.getters.LoginData.token) {
    next();
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      window.location.href = 'login.html';
    }
  }
});

const initVue = () => {
  new Vue({
    data() {
      return {
        searchKey: ''
      }
    },
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

const bootstrap = async () => {
  let info = await axios.get(`/api/admin/user/userInfo1`);
  let menus = await axios.get("/api/admin/user/front/menus");
  if (info.data.status && info.data.status == 40301) {
    //window.location.href = 'login.html';
  } else {
    info.data.uname = decodeURIComponent(info.data.uname);
    info.data.oname = decodeURIComponent(info.data.oname);

    // Cookies.set('Role', info.data.Role);
    // Cookies.set('deptType', info.data.deptType);
    // Cookies.set('md5', info.data.md5);
    // Cookies.set('oid', info.data.oid);
    // Cookies.set('oname', info.data.oname);
    // Cookies.set('token', info.data.token);
    // Cookies.set('uid', info.data.uid);
    // Cookies.set('uname', info.data.uname);
    // Cookies.set('username', info.data.username);

    store.commit('SET_LOGININFO', info.data);
  }
  let data = [];
  if (Array.isArray(menus.data)) {
    for (let item of menus.data) {
      data = data.concat(item.children)
    }
  }
  store.commit('SET_MENUS', data);
  initVue()
};

bootstrap();