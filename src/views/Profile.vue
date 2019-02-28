<template>

    <el-tabs value="first" tab-position="left">
        <el-tab-pane label="基本信息" name="first">
            <el-form ref="form" size="small" class="f_uploadimage">
                <div class="eidt-avatar">
                    <!-- @userName="getUserName" -->

                    <div style="color:red;font-size:12px;color:#ae0c0c;text-align:center;">* 支持.gif,jpeg,jpg,png,bmp中的一种</div>
                    <br />
                    <UploadAvatar :avataruri="form.head.url" @setblob = "setblob"></UploadAvatar>
                </div>
            </el-form>
            <el-form ref="form" :model="form" label-width="80px" size="small" label-position="right" style="width:400px;float:left">
                <el-form-item label="姓名">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="别名">
                    <el-input v-model="form.nick"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.sex" placeholder="请选择性别" style="width:320px">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作签名">
                    <el-input v-model="form.sign"></el-input>
                </el-form-item>
                <el-form-item label="所属部门">
                    <!-- <el-select v-model="form.organ" placeholder="请选择部门" style="width:320px">
                                <el-option label="技术部" value="0"></el-option>
                                <el-option label="财务部" value="1"></el-option>
                                <el-option label="后勤服务部" value="2"></el-option>
                            </el-select> -->
                    <el-input v-model="form.organ" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="手机">
                    <el-input v-model="form.cellphone"></el-input>
                </el-form-item>
                <el-form-item label="座机">
                    <el-input v-model="form.telephone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" :disabled="true"></el-input>
                </el-form-item>
                 <el-form-item label="生日">
                    <el-date-picker v-model="form.birthday" style="width:100%" type="date"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" style="float:right">保存</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="安全管理" name="second">
            <el-form ref="form" label-width="80px" size="small" label-position="right" style="width:400px">
                <el-form-item label="原密码">
                    <el-input v-model="password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input v-model="newPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                    <el-input v-model="comfirmPassword" type="password"></el-input>
                        <span style="color:#ab0e0e;">* 密码必须是至少6位的数字和英文字母组合</span>
                </el-form-item>
                 <el-form-item label="">
                 
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmitPassword" style="float:right">保存</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>

</template>

<script>
import axios from "axios";
import moment from "moment";
import UploadAvatar from "../components/UploadAvatar.vue";
export default {
    data() {
        return {
            form: {
                address: "",
                cellphone: "",
                email: "",
                name: "",
                nick: "",
                sex: "男",
                sign: "",
                telephone: "",
                organ: "",
                birthday: "",
                head: {
                    iconUrl: "",
                    id: "",
                    name: "",
                    type: "",
                    url: ""
                },
                uid: "",
                uname: "",
                oid: "",
                oname: "",
                blob: ""
            },
            username: "",
            password: "",
            newPassword: "",
            comfirmPassword: ""
        };
    },
    components: {
        UploadAvatar
    },

    methods: {
        setblob(data) {
            this.blob = data;
        },
        onSubmit() {
            let self = this;
            if (self.blob) {
                let formData = new FormData();
                formData.append("files", self.blob, "avatar.jpeg");
                axios
                    .post("/api/v1/files/upload", formData)
                    .then(function(response) {
                        self.form.head.iconUrl = response.data[0].iconUrl;
                        self.form.head.url = response.data[0].url;
                        self.form.head.type = response.data[0].type;
                        self.form.head.id = response.data[0].id;
                        self.onSubmitAll();
                    })
                    .catch(function(error) {
                        self.$message({
                            message: "保存头像发生错误",
                            type: "success"
                        });
                    });
            } else {
                self.onSubmitAll();
            }
        },
        onSubmitAll() {
            
            let self = this;
            self.form.birthday = self.form.birthday ? moment(self.form.birthday).format(
                "YYYY-MM-DD"
            ) : "";
            axios.post("/api/v1/profile/saveProfile", self.form).then(res => {
                self.blob = "";
                self.$emit("savesucess");
                self.$message({
                    message: "修改成功",
                    type: "success"
                });
            });
        },
        OnGetUserInfo() {
            axios.get("/api/v1/profile/findProfile").then(res => {
                res.data.organ = res.data.organ
                    ? res.data.organ
                    : this.form.organ;
                this.form = res.data;
            });
        },
        getUsers() {
            axios.get("/api/v1/users").then(res => {
                for (let item of res.data) {
                    if (item.id == this.$store.getters.LoginData.uid) {
                        this.username = item.username;
                    }
                }
            });
        },
        onSubmitPassword() {
            if (this.password == "") {
                this.$message({
                    message: "请输入原密码！",
                    type: "error"
                });
                return false;
            }

            if (this.newPassword == this.comfirmPassword) {
                var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
                if (reg.test(this.newPassword)) {
                    axios
                        .post("/api/admin/user/changePassword", {
                            password: this.password,
                            username: this.username,
                            newPassword: this.newPassword
                        })
                        .then(res => {
                            if (res.data.message == "账号或密码错误") {
                                this.$message({
                                    message: "原密码输入错误！",
                                    type: "error"
                                });
                            } else {
                                this.$message({
                                    message: "密码修改成功！",
                                    type: "success"
                                });
                                this.$emit("savesucess");
                            }
                        });
                } else {
                    this.$message({
                        message: "您输入的密码不符合规范！",
                        type: "error"
                    });
                }
            } else {
                this.$message({
                    message: "两次填写的新密码不一致！",
                    type: "error"
                });
            }
        }
    },
    mounted() {
        this.form.name = this.form.uname = this.$store.getters.LoginData.uname;
        this.form.organ = this.form.oname = this.$store.getters.LoginData.oname;
        this.form.uid = this.$store.getters.LoginData.uid;
        this.form.oid = this.$store.getters.LoginData.oid;
        this.OnGetUserInfo();
        this.getUsers();
    }
};
</script>

<style lang="scss" scoped>
.container {
    background: #f3f3f3;
    height: 100%;
    #profile {
        background: #fff;
        width: 1000px;
        margin: 20px auto;
        overflow: scroll;
        padding-top: 20px;
    }
}
.f_uploadimage {
    width: 280px;
    min-height: 100px;
    float: right;
    position: relative;
}
</style>