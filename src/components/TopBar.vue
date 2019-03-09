
<template>
    <div class="header">
        <div class="top-bar">
            <div class="logo">
                <LeftMenu />
                <a href="" style="height:26px"><img class="app-name" src="@/assets/logo.png" height="25"></a>

            </div>
            <div class="navmenu">
                <el-menu :default-active="this.$router.currentRoute.path" mode="horizontal" background-color="#005a9e" text-color="#fff" :router="true" active-text-color="#ffd04b" popper-class="menu">
                    <el-menu-item index="/portal">集团门户</el-menu-item>
                    <el-menu-item index="/home/todo">我的工作</el-menu-item>
                    <el-menu-item index="/leader" v-show="$store.getters.getMenusByType('leader')">领导驾驶舱</el-menu-item>
                    <el-menu-item index="/docs">文档中心</el-menu-item>
                    <el-menu-item index=""><a target="_blank" href="/api/v1/portal/zfzmail">我的邮箱</a></el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">常用链接</template>
                        <el-menu-item index=""><a href="http://www.zgcgroup.com.cn" style="color:#fff" target="_blank">集团官网</a></el-menu-item>
                        <el-menu-item index=""><a href="http://zgcgroup.21tb.com/login/login.init.do" style="color:#fff" target="_blank">网络学院</a></el-menu-item>
                        <el-menu-item index=""><a href="http://172.30.30.2:8088/ESAIS/flex/index.jsp?nodecode=Z32701" style="color:#fff" target="_blank">档案查询</a></el-menu-item>
                        <el-menu-item index=""><a href="http://nc.zgcgroup.com.cn/login.jsp?nodecode=E32709" style="color:#fff" target="_blank">NC门户</a></el-menu-item>
                        <el-menu-item index=""><a href="http://www.beijing.gov.cn/?nodecode=Z32708" style="color:#fff" target="_blank">首都之窗</a></el-menu-item>
                        <el-menu-item index=""><a href="http://fgw.beijing.gov.cn" style="color:#fff" target="_blank">市发改委</a></el-menu-item>
                        <el-menu-item index=""><a href="http://www.bjeit.gov.cn/?nodecode=Z32704" style="color:#fff" target="_blank">市经信委</a></el-menu-item>
                        <el-menu-item index=""><a href="http://kw.beijing.gov.cn" style="color:#fff" target="_blank">市科委</a></el-menu-item>
                        <el-menu-item index=""><a href="http://sww.beijing.gov.cn/?nodecode=Z32705" style="color:#fff" target="_blank">市商委</a></el-menu-item>
                        <el-menu-item index=""><a href="http://zgcgw.beijing.gov.cn" style="color:#fff" target="_blank">中关村管委会</a></el-menu-item>
                        <el-menu-item index=""><a href="http://www.bjzgh12351.org/template/10021/index.jsp" style="color:#fff" target="_blank">12351职工服务网</a></el-menu-item>
                        <el-menu-item index=""><a href="http://www.bjzgh.org" style="color:#fff" target="_blank">北京市总工会</a></el-menu-item>
                        <el-menu-item index=""><a href="http://www.cnki.net" style="color:#fff" target="_blank">知网</a></el-menu-item>
        
                    </el-submenu>
                </el-menu>
            </div>
            <div class="search">
                <el-input size="small" placeholder="请输入搜索内容" v-model="$root.searchKey" @keyup.enter.native="search()" suffix-icon="el-icon-search">
                </el-input>
            </div>
            <div class="info">Hello，{{$store.getters.LoginData.uname}}&nbsp;&nbsp;&nbsp;在线：{{uc}}</div>
            <div class="tools">
                <Link />
                <!--Notice /-->
                <!--Settings /-->
                <User />
            </div>
        </div>

    </div>
</template>

<script>
import LeftMenu from "./LeftMenu.vue";
import Notice from "./Notice.vue";
import Settings from "./Settings.vue";
import User from "./User.vue";
import Link from "./Link.vue";
import Vue from "vue";
import axios from 'axios'

export default {
    name: "topbar",
    directives: {},
    components: {
        LeftMenu,
        Notice,
        Settings,
        User,
        Link
    },
    data() {
        return {
            uc:0
        };
    },

    methods: {
        search() {
            if (this.$root.searchKey.trim().length > 0) {
                //if (this.$router.currentRoute.path == "/search/"+this.$root.searchKey) {
                this.$router.replace({
                    path: "/search/" + this.$root.searchKey
                });
                // } else {
                //this.$router.push({ path: "/search/"+this.$root.searchKey });
                //}
            } else {
                this.$router.go(-1);
            }
        },
        open(data) {
            const h = this.$createElement;
            let type = data.groupId ? "群" : "个人";
            let message = data.from_info.name + "发来的" + type + "消息";
            let msg = "";
            if(data.type){
                    msg = data.type == "word" ? data.msg : JSON.parse(data.msg).name;
            }else{
                    msg = data.msg;
            }
         
            this.$notify({
                title: message,
                type: "success",
                duration: "0",
                offset: 1,
                message: h("i", { style: "color: teal" },msg)
            });
        }
    },
    // sockets: {
    //     connect() {
    //         console.log("soket connect... ");
    //     },
    //     message(value) {
    //         console.log(value);
    //         if(Array.isArray(value)){
    //             this.open(value[0]);
    //         }else{
    //         if (value.from != this.$store.getters.LoginData.uid) {
    //             this.open(value);
    //          }
    //         }
    //     },

    // },
    mounted() {
        let url = "";
        if (process.env.NODE_ENV === "production") {
            url = "http://172.16.3.17";
        } else {
            url = "http://59.110.172.228:10988";
        }
        if (!Vue.prototype.socket) {
            Vue.prototype.socket = io(url);
            this.socket.on("connect", data => {});
            this.socket.emit("join", this.$store.getters.LoginData.uid);
            this.socket.on("message", value => {
                if (Array.isArray(value)) {
                    this.open(value[0]);
                } else {
                    if (value.from != this.$store.getters.LoginData.uid) {
                        this.open(value);
                    }
                }
            });
        }
        axios.get('/api/v1/portal/uc').then(res => {
            this.uc = res.data;
        })
    }
};
</script>

<style lang="scss" scoped>
.top-bar {
    background: #005a9e;
    height: 48px;
    color: #ffffff;
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    .logo {
        display: flex;
        align-items: center;
        width: 320px;
        .app-name {
            margin-left: 10px;
        }
        flex: 0 0 auto;
    }
    .navmenu {
        width:640px;      
        flex: 0 0 auto;
    }
    input::-webkit-input-placeholder {
        color: #000;
        font-size: 14px;
    }
    .search {
        flex: 1 1 auto;
        .el-input__inner {
            background: rgba(255, 255, 255, 0.7);
            border: none;
            width: 350px;
            &:focus {
                width: 350px;
                background: #ffffff;
                transition: width 0.3s;
            }
        }
    }
    .info {
        width: 220px;
        flex: 0 0 auto;
        text-align: right;
    }
    .tools {
        display: flex;
        flex: 0 0 auto;
        width: 120px;
        justify-content: flex-end;
    }
    .active {
        background: #fff;
        color: #004578;
        &:hover {
            background: #fff;
        }
    }
    .el-menu--horizontal > .el-menu-item,.el-submenu {
        height: 48px;
        line-height: 48px;
        font-weight: 600;
    }

}
</style>