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
          <el-button @click="logout" type="text">退出登录</el-button>
        </div>
      </div>
    </transition>
    <el-dialog title="编辑个人资料" :visible.sync="outerVisible" width="900px">
      <Profile @savesucess="savesucess"></Profile>
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
      showUser: false
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
        // if (process.env.NODE_ENV == 'test') {
        //   window.location.href = "/logout";
        // } else {
        //   window.location.href = "login.html";
        // }       
      });
    },
    aaa() {
      this.showUser = false;
    }
  },
  mounted() {}
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
