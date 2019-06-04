
<template>
    <div class="header">
        <div class="top-bar">
            <div class="logo">
                <LeftMenu />
                <a href="" style="height:26px"><img class="app-name" src="@/assets/logo.png" height="25"></a>

            </div>
            <div class="navmenu">
                <el-menu :default-active="this.$router.currentRoute.path" mode="horizontal" background-color="#005a9e" text-color="#fff" :router="true" active-text-color="#ffd04b" popper-class="menu">
                    <el-menu-item index="/portal">公司门户</el-menu-item>
                    <el-menu-item index="/home/todo">我的工作</el-menu-item>
                    <el-menu-item index="/leader" v-show="$store.getters.getMenusByType('leader')">领导驾驶舱</el-menu-item>
                    <el-menu-item index="/docs">文档中心</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">常用链接</template>
                        <!-- <el-menu-item index=""><a href="https://www.fxiaoke.com/" style="color:#fff;display:block" target="_blank">纷享销客</a></el-menu-item> -->
                        <el-menu-item index=""><a href="http://zhizhao.bjzcdi.com" style="color:#fff;display:block" target="_blank">大数据平台</a></el-menu-item>
                        <el-menu-item index=""><a href="https://www.wind.com.cn/newsite/data.html" style="color:#fff;display:block" target="_blank">wind-数据服务</a></el-menu-item>       
                        <el-menu-item index=""><a href="https://creis.fang.com/land/home/index" style="color:#fff;display:block" target="_blank">CREIS指数</a></el-menu-item>       
                         <el-menu-item index=""><a href="http://mail.bjzcdi.com" style="color:#fff;display:block" target="_blank">邮箱链接</a></el-menu-item>
                        <el-menu-item index=""><a href="http://www.bjzcdi.com/" style="color:#fff;display:block" target="_blank">公司网站</a></el-menu-item>       
                        
                    </el-submenu>
                </el-menu>
            </div>
            <div class="search">
                <el-input size="small" placeholder="请输入搜索内容" v-model="$root.searchKey" @keyup.enter.native="search()" suffix-icon="el-icon-search">
                </el-input>
            </div>
            <el-cascader
                v-if="options.length > 0"
                expand-trigger="hover"
                :options="options"
                placeholder="请选择公司或部门"
                v-model="selectedOptions"
                @change="handleChange">
            </el-cascader>
            <!-- <div class="info">Hello，{{$store.getters.LoginData.uname}}&nbsp;&nbsp;&nbsp;在线：{{uc}}</div> -->
            <div class="info">Hello，{{$store.getters.LoginData.uname}}&nbsp;&nbsp;&nbsp;在线：{{uc}}</div>
            <div class="tools">
                <Link />
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
            uc:0,
            selectedOptions: [],
            checkedObject: {},
            options: []
        };
    },

    methods: {
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
        async handleChange(value) {
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
                let $self = this;
                let departments = $self.$axios
                .post('/api/auth/jwt/switchingDepartments',this.checkedObject)
                if(departments) {
                    // if(departments.data.status == 200) {
                        this.$message({
                            type:"success",
                            message: '更换成功'
                        });
                    // } else {
                    //     this.$message({
                    //         type:"warning",
                    //         message: '服务器异常'
                    //     });
                    // }
                }
                let info = await axios.get(`/api/admin/user/userInfo1`);
                window.history.go(0)
                // if (info.data.status && info.data.status == 40301) {
                //     //window.location.href = 'login.html';
                // } else {
                //     info.data.uname = decodeURIComponent(info.data.uname);
                //     info.data.oname = decodeURIComponent(info.data.oname);
                //     store.commit('SET_LOGININFO', info.data);
                // }     
            }
        },
        // open(data) {
        //     const h = this.$createElement;
        //     let type = data.groupId ? "群" : "个人";
        //     let message = data.from_info.name + "发来的" + type + "消息";
        //     let msg = "";
        //     if(data.type){
        //             msg = data.type == "word" ? data.msg : JSON.parse(data.msg).name;
        //     }else{
        //             msg = data.msg;
        //     }
         
        //     this.$notify({
        //         title: message,
        //         type: "success",
        //         duration: "0",
        //         offset: 1,
        //         message: h("i", { style: "color: teal" },msg)
        //     });
        // }
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
        // let url = "";
        // if (process.env.NODE_ENV === "production") {
        //     url = "/";
        // } else {
        //     url = "http://116.117.157.232:10088";
        // }
        // if (!Vue.prototype.socket) {
        //     Vue.prototype.socket = io(url);
        //     this.socket.on("connect", data => {});
        //     this.socket.emit("join", this.$store.getters.LoginData.uid);
        //     this.socket.on("message", value => {
        //         if (Array.isArray(value)) {
        //             this.open(value[0]);
        //         } else {
        //             if (value.from != this.$store.getters.LoginData.uid) {
        //                 this.open(value);
        //             }
        //         }
        //     });
        // }
        axios.get('/api/v1/portal/uc').then(res => {
            this.uc = res.data;
        })

        this.checkeUserOrgans(this.$store.getters.LoginData.username);
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