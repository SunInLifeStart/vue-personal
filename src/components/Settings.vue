<template>
    <div class="drawer" v-bind:class="{ active: showSetting }" v-click-outside="aaa" v-on:click="showSetting=true">
        <div class="icon"><i class="iconfont el-icon-settings" size="18" /></div>
        <transition name="custom-classes-transition" enter-active-class="animated slideInRight faster">
            <div class="settings" v-show="showSetting">
                <div class="panel">
                    <span class="title">快速设置</span>
                    <span class="close" outside=true @click="showNotice=false">&times;</span>
                </div>
                <!--el-form label-position="top" class="demo-form-inline" width="100%">
                    <el-form-item>
                        <el-switch v-model="enable" @change="changeProxy" active-text="启用代理人">
                        </el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="proxyId" @change="changeProxy" filterable :disabled="enable" width="100%" placeholder="选择代理人">
                            <el-option v-for="user in users" :key="user.id" :value="user.id" :label="user.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form-->
                <el-form label-position="top">
                    <el-form-item label="切换登录">
                        <el-select v-model="loginId" @change="changeLogin" filterable width="100%" placeholder="选择登录用户">
                            <el-option v-for="user in users" :key="user.id" :value="user.username" :label="user.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import ClickOutside from "@/directives/clickoutside";
import Cookies from 'js-cookie'
export default {
    name: "setting",
    data() {
        return {
            showSetting: false,
            enable: false,
            users: [],
            proxyId: "",
            loginId: ""
        };
    },

    directives: {
        ClickOutside
    },
    methods: {
        aaa() {
            this.showSetting = false;
        },
        getUsers() {
            axios.get("/api/v1/users").then(res => {
                this.users = res.data;
            });
            axios.post("/api/v1/users/agent/select").then(res => {
                this.proxyId = res.data;
            });
        },
        changeLogin() {
            if (this.loginId) {

                this.$store.dispatch("Login",{username:this.loginId,password:'123456'}).then(res=>{
                    this.$router.push({path:'/'});
                });
                
            }
        },
        changeProxy() {
            if (this.proxyId) {
                axios.post(
                    `/api/v1/users/agent/${this.proxyId}/${
                        this.enable ? "open" : "close"
                    }`
                );
            }
        }
    },
    mounted() {
        this.getUsers();
    }
};
</script>

<style lang="scss" scoped>
.settings {
    background: #fff;
    position: absolute;
    display: block;
    top: 48px;
    right: 0;
    bottom: 0;
    width: 279px;
    box-shadow: rgba(0, 0, 0, 0.2) -30px 0px 30px -30px;
    padding: 23px 18px 0 23px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    z-index: 999;
    overflow: scroll;
}
</style>
