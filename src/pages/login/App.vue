<template>
    <div id="login">
        <div class="login">
            <div class="box-card">
                <div class="left">
                    <img src="@/assets/logo.png" alt="">
                </div>
                <div class="right">
                    <el-form ref="form" :rules="rules2" :model="form" label-position="top" label-width="80px">
                        <h2 class="title">
                            登录
                        </h2>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="form.username" @keyup.enter.native="login" size="small" placeholder="输入登录账号"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="form.password" type="password" size="small" @keyup.enter.native="login" placeholder="密码"></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="checked">
                            &nbsp;&nbsp;<el-checkbox v-model="checked" label="记住密码"></el-checkbox>
                        </el-form-item>
    
                        <el-form-item style="text-align:right">
                            <el-button type="primary" size="small" class="btn-login" style="border-radius: 16px;" @click="login">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>

            </div>
        </div>
        <div class="footer">©2018 中关村发展集团</div>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "login",
    data() {
        var validateUserName = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else {
                callback();
            }
        };
        var validatePassword = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        return {
            form: {
                username: localStorage.zfzusername||'',
                password: localStorage.zfzpassword||'',
            },
            checked: localStorage.zfzchecked == 'true'||false,
            rules2: {
                username: [{ validator: validateUserName, trigger: "blur" }],
                password: [{ validator: validatePassword, trigger: "blur" }]
            }
        };
    },
    methods: {
        login() {
            let self = this;
            this.$refs["form"].validate(valid => {
                if (valid) {
                    let host = 'zgcgroup.vpn';
                    let formdata = {
                        username: this.form.username,
                        password: this.form.password,
                        remember: true
                    }
                    if (this.checked == true){
                        localStorage.zfzusername = this.form.username;
                        localStorage.zfzpassword = this.form.password;
                        localStorage.zfzchecked = true;
                    }else{
                        localStorage.zfzusername = '';
                        localStorage.zfzpassword = '';
                        localStorage.zfzchecked = false;
                    }
                    if (process.env.NODE_ENV == 'production') {
                        formdata.host = host;
                    }
                    if(window.location.host=='work.yxpe.com.cn'){
                        formdata.host = 'yxpe.com.cn';
                    }
                    this.$store
                        .dispatch("Login", formdata)
                        .then(data => {
                            window.location.href = '/';
                                                                         
                        }).catch(error => {
                            this.$message({
                                message: '用户名或密码错误',
                                type: 'error'
                            });
                        });
                } else {
                    return false;
                }
            });
        }
    },
    mounted() {
        console.log(this.checked)
    }
};
</script>

<style lang="scss">
html,body{
    height: 100%;
}
#login {
    display: table;
    background: url(../../assets/0.jpg);
    background-size:100% auto;
    width: 100%;
    height: 100%;
    .login {
        width:100%;
        display: table-cell;
        vertical-align: middle;
        .title {
            color: #3a5491;
            margin-bottom: 20px;
            margin-left: 8px;
        }
        .left {
            background-color:rgba(22, 15, 112, 0.3);
            float: left;
            width: 450px;
            height: 400px;
            text-align: right;
            padding: 70px;
            box-sizing: border-box;
        }
        .right {
            background: #fff;
            float: left;
            width: 265px;
            height: 400px;
            padding: 33px;
            box-sizing: border-box;
        }
        .box-card {
            margin: 0 auto;
            width: 720px;
        }
        .btn-login {
            width: 100%;
            background: #3a5491;
        }
        .el-form-item__label {
            margin-left: 1em;
            padding:0;
        }
        .el-input__inner {
            border-radius: 16px !important;
        }        
    }
    .footer {
            position: fixed;
            left: 0;
            right: 0;
            height: 28px;
            line-height: 28px;
            color: #eee;
            font-size: 12px;
            padding: 0 30px;
            bottom: 0;
            text-align: center;
            overflow: visible;
            z-index: 99;
            clear: both;
            background-color: rgba(0, 0, 0, 0.6);
        }
}
</style>
