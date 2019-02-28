import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    newTodoMessage: 0,
    newMessage: 0,
    loginData: Object,
    menus:[]
  },
  getters: {
    LoginData(state) {
      return state.loginData;
    },
    getNewTodo(state) {
      return state.newTodoMessage;
    },
    getNewMessage(state) {
      return state.newMessage;
    },
    getMenus(state) {
      return state.menus;
    },
    getMenusByType:(state) => (type) => {
      let result = state.menus.find(item => item.code === type);
      return result?result.children:false;
    }
  },
  mutations: {
    SET_LOGININFO(state, data) {
      state.loginData = data;
    },
    SET_MENUS(state, data) {
      state.menus = data;
    },
    NEW_TODO(state, data) {
      state.newTodoMessage = data;
    },
    NEW_MESSAGE(state, data) {
      state.newMessage = data;
    }
  },
  actions: {
    Login(context, data) {
      return new Promise((resolve, reject) => {
        axios.post("/api/auth/jwt/token", data).then(res => {
          if (res.data.status == 40001) { 
            reject(res.data);                                    
          }else{
            resolve(res.data);
          }
        }).catch(error => {
          reject(error);
        });
      });

    },
    Logout() {
      return new Promise((resolve) => {
        let data = {};
        if (process.env.NODE_ENV == 'production') {
          data.domain = 'zgcgroup.vpn';
        }
        axios.post('/api/auth/jwt/deleteCookie',data).then(res => {
          resolve(res.data);
        }); 
      });

    },
    addTodo(context,data) {
      context.commit('NEW_TODO',data)
    },
    addMessage(context, data) {
      context.commit('NEW_MESSAGE', data)
    },
    subscribe(context){

      return new Promise((resolve, reject) => {
        axios.get(`/api/v1/push/${this.state.loginData.uid}/sub`,{timeout: 1000 * 60 * 2}).then(res => {
          if (res.data.status == 200) {
            if(res.data.message.type=='todo'){
              context.commit('NEW_TODO',1);
            }
            if(res.data.message.type=='message'){
              context.commit('NEW_MESSAGE',1);
            }
            resolve(res.data);
          }
        }).catch(error => {
          reject(error);
        });
      });    
    },
    getUserInfo(context){
      return new Promise((resolve) => {
        axios.get(`/api/admin/user/userInfo`).then(res => {
          res.data.uname = decodeURIComponent(res.data.uname);
          res.data.oname = decodeURIComponent(res.data.oname);
          context.commit('SET_LOGININFO', res.data);
          resolve(res.data);
        });
      });
    },
    getMenus(context){
      return new Promise((resolve) => {

        axios.get("/api/admin/user/front/menus").then(res => {
          let data = [];
          if(Array.isArray(res.data)){
            for(let item of res.data){
              data = data.concat(item.children)
            }
          }

          context.commit('SET_MENUS', data);
          resolve(data);
        });
        
      });

    }
  }
})
