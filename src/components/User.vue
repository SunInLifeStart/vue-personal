<template>
  <div class="drawer" v-bind:class="{ active: showUser }" v-click-outside="aaa">
    <div class="icon" v-on:click="showUser=true">
      <img src="@/assets/avatar.png" width="26" alt>
    </div>
    <transition name="custom-classes-transition" enter-active-class="animated slideInRight faster">
      <div class="user-info" v-show="showUser">
        <div class="panel">
          <span class="title">我的账户</span>
          <span class="close" outside="true" @click="showNotice=false">&times;</span>
        </div>
        <div class="avatar">
          <img src="@/assets/avatar.png" width="48" alt>
          <span class="name">{{$store.getters.LoginData.uname}}</span>
        </div>
        <div class="item-text">
          {{$store.getters.LoginData.oname}} -
          <span>角色未知</span>
        </div>
        <div class="item-text">
          <a
            href="javascript:;"
            class="el-button el-button--text el-button--small"
            @click="outerVisible = true"
            outside="true"
          >编辑个人资料</a>
        </div>
        <div class="item-text">
          <el-button type="text" @click="dialogUserId = true">切换登录身份</el-button>
        </div>
        <div class="item-text">
          <el-button @click="logout" type="text">退出登录</el-button>
        </div>
      </div>
    </transition>
    <el-dialog title="编辑个人资料" :visible.sync="outerVisible" width="900px">
      <Profile @savesucess="savesucess"></Profile>
    </el-dialog>

     <el-dialog title="切换登录身份" :visible.sync="dialogUserId" width="500px">
          <div class="block" v-if="options.length > 0">
          <el-cascader
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              @change="handleChange" style="width:100%">
          </el-cascader>
        </div>
        <br />
         <el-button type="primary" @click="submitUserId()">确定</el-button>
    </el-dialog>

        
  </div>
</template>

<script>
import ClickOutside from "@/directives/clickoutside";
import Profile from "../views/Profile.vue";
import axios from "@/plugins/axios";
import Cookies from 'js-cookie'

export default {
  name: "notice",
  data() {
    return {
      outerVisible: false,
      showUser: false,
      options:[],
      selectedOptions:[],
      dialogUserId:false
    };
  },
  components: {
    Profile
  },
  directives: {
    ClickOutside
  },
  methods: {
    savesucess() {
      this.outerVisible = false;
    },
    logout() {
      this.socket.emit("offLine");
      this.$store.dispatch("Logout").then(() => {
        Cookies.remove("Role");
        Cookies.remove("deptType");
        Cookies.remove("md5");
        Cookies.remove("oid");
        Cookies.remove("oname");
        Cookies.remove("token");
        Cookies.remove("uid");
        Cookies.remove("uname");
        Cookies.remove("username");
        window.location.href = "login.html";  
      });
    },
     handleChange(value) {
             let $self = this;
              for(let i = 0; i<$self.options.length; i++){
                if($self.options[i].value == value[0]){
                    for(let j = 0; j< $self.options[i].children.length; j++){
                        if($self.options[i].children[j].value == value[1]){
                             $self.checkedObject = $self.options[i].children[j];
                        }
                    }
                }
            }   
      },
      checkeUserOrgans(name){
            let $self = this;
             $self.$axios
            .get('/api/v1/organ/checkDepartment/' + name)
            .then(res => {
                if(res.data.length == 1){
                    if(res.data[0].children.length == 1){
                        $self.options = $self.selectedOptions = [];
                        $self.checkedObject = res.data[0].children[0];
                    }else{
                        $self.options = res.data;             
                    }
                }
                 if(res.data.length > 1){
                     $self.options = res.data; 
                     $self.$forceUpdate();
                }
            })          
        },
        submitUserId(){
            if(this.selectedOptions.length == 0){
               this.$message({
                type:"warning",
                message: '请选择身份'
              });
            }else{
                // Cookies.remove("Role");
                // Cookies.remove("deptType");
                // Cookies.remove("md5");
                // Cookies.remove("oid");
                // Cookies.remove("oname");
                // Cookies.remove("token");
                // Cookies.remove("uid");
                // Cookies.remove("uname");
                // Cookies.remove("username");
                 this.$store
                .dispatch("Login", formdata)
                .then(data => {
                                                                           
               })
            }
        },
    aaa() {
      this.showUser = false;
    }
  },
  mounted() {
    this.checkeUserOrgans(this.$store.getters.LoginData.username);
  }
};
</script>

<style lang="scss" scoped>
.user-info {
  background: #fff;
  position: absolute;
  top: 48px;
  right: 0;
  bottom: 0;
  width: 279px;
  line-height: 40px;
  box-shadow: rgba(0, 0, 0, 0.2) -30px 0px 30px -30px;
  padding: 10px 18px 0 23px;
  z-index: 9999;
  color: #303133;
  .avatar {
    display: flex;
    align-items: center;
    width: 100%;

    text-align: left;
    .name {
      padding-left: 16px;
    }
  }
  .item-text {
    margin-left: 8px;
  }
}
</style>
