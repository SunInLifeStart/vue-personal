<template>
    <div id="login">
        <div class="login">
            <div class="box-card">
                <div class="left">
                    <img src="@/assets/logo.png" alt=""  width="350px">
                </div>
                <div class="right">
                    <el-form ref="form" :rules="rules2" :model="form" label-position="top" label-width="80px">
                        <h2 class="title">
                            登录
                        </h2>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="form.username" @keyup.enter.native="login" size="small" placeholder="输入登录账号" @change="checkeUserOrgans(form.username)"></el-input>
                        </el-form-item>             
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="form.password" type="password" size="small" @keyup.enter.native="login" placeholder="密码"></el-input>
                        </el-form-item>
                        <el-form-item label="请选择身份或者部门" v-if="options.length > 0">
                            <div class="block">
                                <el-cascader
                                    expand-trigger="hover"
                                    :options="options"
                                    v-model="selectedOptions"
                                    @change="handleChange" style="width:100%">
                                </el-cascader>
                            </div>
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
        <div class="footer">©2019 中关村协同发展</div>
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
            },
            options:[],
            selectedOptions:[],
            checkedObject:{},
        };
    },
    methods: {
        login() {
            let self = this;
            this.$refs["form"].validate(valid => {
                if (valid) {
        

                    if(this.options.length > 0 && this.selectedOptions.length == 0){
                        this.$message({
                            type: "warning",
                            message: '请选择身份或者部门'
                        });
                        return false;
                    }

                    if(this.options.length == 0 && this.selectedOptions.length == 0 && JSON.stringify(this.checkedObject) == "{}"){
                        this.checkeUserOrgans(this.form.username,"fromLogin"); //记住密码的情况
                        return false;
                    }
                    
                    let formdata = {
                        username: this.form.username,
                        password: this.form.password,
                        remember: true,
                        department:this.checkedObject
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
        },
        checkeUserOrgans(name,fromLogin){
            let $self = this;
             $self.$axios
            .get('/api/v1/organ/checkDepartment/' + name)
            .then(res => {
                if(res.data.length == 1){
                    if(res.data[0].children.length == 1){
                        $self.options = $self.selectedOptions = [];
                        $self.checkedObject = res.data[0].children[0];
                        if(fromLogin){
                            this.login();
                        }
                    }else{
                        $self.options = res.data;             
                    }
                }
                 if(res.data.length > 1){
                     $self.options = res.data;            
                }
            })          
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
            height: 500px;
            text-align: right;
            padding: 70px;
            box-sizing: border-box;
        }
        .right {
            background: #fff;
            float: left;
            width: 265px;
            height: 500px;
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
