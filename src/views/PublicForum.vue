<template>
    <div id="app">
        <TopBar />
        <div class="container">
            <div id="publicforum">
                <div class="leftnav">
                    <div class="addgroup">
                        <div>我的群组<i class="el-icon-plus" @click="addGroupDialogStatus = true"></i></div>
                    </div>
                    <div class="grouplist">
                        <el-row class="tac">
                            <el-col :span="12">
                                <el-menu :default-active="activeli" :unique-opened="true" class="el-menu-vertical-demo" background-color="#f1f1f1" text-color="#000" active-text-color="#409EFF" @open="handleOpen" @close="handleClose">
                                    <el-submenu index="1">
                                        <template slot="title">
                                            <i class="el-icon-location"></i>
                                            <span>我创建的群组</span>
                                        </template>
                                        <el-menu-item-group>
                                            <el-menu-item v-for="item in groupList.meList" :index="JSON.stringify(item.id)" :key="item.id" @click="getDetailsList(item)">{{item.groupName}}</el-menu-item>
                                        </el-menu-item-group>
                                    </el-submenu>
                                    <el-submenu index="2">
                                        <template slot="title">
                                            <i class="el-icon-document"></i>
                                            <span>我加入的群组</span>
                                        </template>
                                        <el-menu-item-group>
                                            <el-menu-item v-for="item in groupList.hereList" :index="JSON.stringify(item.id)" :key="item.id" @click="getDetailsList(item)">{{item.groupName}}</el-menu-item>
                                        </el-menu-item-group>
                                    </el-submenu>
                                </el-menu>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <div class="rightcontent" style="position:relative;">
                    <el-row class="topgroupmsg" v-show="topGroupAction">
                        <el-col :span="17">
                            <div style="text-align:left;padding:5px;">
                                <div style="font-size:18px;font-weight:bold"> {{currentItem.groupName}} <i class="el-icon-delete" style="color:rgb(178, 39, 39);font-size:13px;cursor:pointer" @click="deleteGroup" v-if="currentItem.uid == currentUserId"></i></div>
                                <div style="font-size:13px;padding:5px 0px"> 成员 ：({{currentItem.users | filterGroupName(userList)}})</div>
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div style="text-align:right;padding:15px;">
                                <el-button type="primary" size="small" icon="el-icon-edit" @click="questionDialogStatus = true">提问题</el-button>
                                <el-button type="primary" size="small" icon="el-icon-share" @click="shareIdeaDialogStatus = true">写想法</el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="nomessage" v-if="!topGroupAction">
                        您还没有建群组,赶快新创建一个吧
                    </div>
                    <div class="nomessage" v-if="releasesList.length == 0 && topGroupAction">
                        群组暂无数据消息，赶快添加一条吧
                    </div>
                    <div style="width:100%;margin-top:100px;">
                        <el-row v-for="item in releasesList" :key="item.id" class="rowline">
                            <el-col :span="2"><span style="display:inline-block;width:40px;height:40px; color:#FFF; text-align:center; line-height:40px; background:#ccc; border-radius:50%;font-size:18px;">{{item.name[0]}}</span></el-col>
                            <el-col :span="22">
                                <el-row>
                                    <el-col :span="24">
                                        <div class="name">{{item.name}}</div>
                                        <div class="content">
                                            {{item.content}}
                                        </div>
                                        <div class="attachs" v-if="item.data && item.data.length > 0">
                                             <div v-for="currentItem in item.data" :key="currentItem.id" style="float:left">
                                                <FilesOperate :item="currentItem.response[0]" :options="{preview:true,download:true}"></FilesOperate>
                                            </div>
                                        </div>
                                        <div class="thumbsup">
                                            <el-button type="primary" style="background:none;color:#666;border:none" icon="el-icon-star-off" size="small" @click="thumbsup(item)">赞同 <span v-if="item.laud > 0">({{item.laud}})</span></el-button>
                                        </div>
                                        <div class="usercomment">
                                            <div class="changehidden" v-if=" item.comments.length > 0"><span @click="changeHidden(item)"><span v-if="!item.hidden">收起评论</span><span v-if="item.hidden">展开评论</span>({{ item.comments.length}})</span></div>
                                            <el-collapse-transition>
                                                <div v-show="!item.hidden" style="padding-bottom:10px" class="items">
                                                    <div class="item" v-for="item in item.comments" :key="item.time">
                                                        <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="36px"></div>
                                                        <div class="info">
                                                            <div class="creator">
                                                                <span href="#">{{item.name}}</span>
                                                            </div>
                                                            <div class="content">{{item.content}}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </el-collapse-transition>
                                        </div>
                                        <div class="content">
                                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 20}" v-model.trim="item.commentValue" placeholder="请输入评论内容"></el-input>
                                        </div>

                                        <div class="content">
                                            <el-button type="primary" size="small" @click="submitComment(item)">提交评论</el-button>
                                        </div>

                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <!-- 群组组件 -->
                <el-dialog title="创建群组" :visible.sync="addGroupDialogStatus" :close-on-click-modal="false" max-width="1280px" width="40%">

                    <el-form label-width="100px" :model="groupDialogModel" :rules="rulesCreateGroup" ref="formVaildCreateGroup">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="组名称" prop="groupName">
                                    <el-input v-model="groupDialogModel.groupName" placeholder="请填写组名称"></el-input>
                                </el-form-item>

                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="组成员" prop="users">
                                    <el-select style="width:100%;" v-model="groupDialogModel.users" multiple filterable readonly default-first-option placeholder="请选择组成员">
                                        <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                &nbsp;
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" size="small" @click="createGroup()">创建群组</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-dialog>

                <el-dialog title="提出问题" :visible.sync="questionDialogStatus" :close-on-click-modal="false" max-width="1280px" width="40%" style="text-align: center;">
                    <el-form :model="questionDialogModel" :rules="rulesQuestion" ref="formVaildQuestion">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="content">
                                    <div style="text-align:left; text-indent:10px;color:rgb(174, 65, 65)">*写下你的问题,准确的描述问题更容易得到解答</div>
                                    <el-input type="textarea" v-model.trim="questionDialogModel.content" :autosize="{ minRows: 2, maxRows: 20}" placeholder="请填写你的问题"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                &nbsp;
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" size="small" @click="submitQuestions()">提交问题</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-dialog>

                <el-dialog title="分享想法" :visible.sync="shareIdeaDialogStatus" :close-on-click-modal="false" max-width="1280px" width="40%" style="text-align: center;">
                    <el-form :model="ideaDialogModel" :rules="rulesShareIdea" ref="formVaildShareIdea">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="content">
                                    <el-input type="textarea" v-model="ideaDialogModel.content" :autosize="{ minRows: 2, maxRows: 20}" placeholder="请填写你的想法"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row style="text-align:left">
                            <el-col :span="24">
                                <div style="padding:10px 0px;color:#930b0b">*上传文档、照片或视频({{ideaDialogModel.attachments.length}}/9)</div>
                                <div>
                                    <el-upload name="files" ref="upload" action="/api/v1/files/upload" list-type="picture-card" :on-change="handChange" :on-remove="handleRemove" :limit="5">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="dialogVisible">
                                        <img width="100%" :src="dialogImageUrl" alt="">
                                    </el-dialog>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20">
                                &nbsp;
                            </el-col>
                            <el-col :span="4">
                                <el-button type="primary" size="small" @click="shareIdeas()">提交想法</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { version } from "moment";
import Cookies from "js-cookie";
import Vue from "vue";
import TopBar from "@/components/TopBar.vue";
import FilesOperate from "@/apps/FilesOperate.vue";
export default {
    data() {
        return {
            addGroupDialogStatus: false,
            questionDialogStatus: false,
            shareIdeaDialogStatus: false,
            groupDialogModel: {
                users: [],
                groupName: ""
            },
            questionDialogModel: {
                content: ""
            },
            ideaDialogModel: {
                content: "",
                attachments: []
            },
            releasesList: [],
            users: [],
            groupList: { meList: [], hereList: [] },
            activeli: "1",
            topGroupAction: false,
            currentItem: {},
            dialogVisible: false,
            dialogImageUrl: "",
            imageUrl: "",
            currentUserId:"",
            userList: [],
            rulesCreateGroup: {
                groupName: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请填写组名称"
                    }
                ],
                users: [
                    {
                        required: true, //是否必填
                        trigger: "change", //何事件触发
                        message: "请选择组成员"
                    }
                ]
            },
            rulesQuestion: {
                content: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请填写你的问题"
                    }
                ]
            },
            rulesShareIdea: {
                content: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请填写你的想法"
                    }
                ]
            }
        };
    },
    components: {
        TopBar,
        FilesOperate
    },
    filters: {
        filterGroupName: function(ids, userList) {
            let userArr = [];
            if (ids && ids.length > 0) {
                for (let item of userList) {
                    for (let id of ids) {
                        if (id == item.id) {
                            userArr.push(item.name);
                        }
                    }
                }
                return userArr.join(",");
            }
        }
    },
    mounted: function() {
        //this.getUserList();
        this.getGroupList();
        this.getUsers();
        this.currentUserId =  this.$store.getters.LoginData.uid
    },
    methods: {
        deleteGroup() {
            let self = this;
            self.$confirm("确定要删除此组吗, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                axios
                    .post("/api/portal/del", { groupId: self.currentItem.id })
                    .then(res => {
                        if (res.data.error == 0) {
                            self.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            self.getGroupList();
                        }
                    });
            });
        },
        getUsers() {
            axios.get("/api/v1/users").then(res => {
                this.userList =  res.data;
            });
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        changeHidden(item) {
            this.$set(item, "hidden", !item.hidden);
        },

        //提交评论
        submitComment(item) {
            axios
                .post("/api/portal/comment", {
                    id: item.id,
                    content: item.commentValue,
                    uid: 7
                })
                .then(response => {
                    console.log(item.comments);
                    if (response.data.error == 0) {
                        item.comments.push(response.data.comment);
                        item.commentValue = "";
                    }
                });
        },

        //点赞
        thumbsup(item) {
            axios.post("/api/portal/laud", { id: item.id }).then(response => {
                item.laud ++;
            });
        },

        // //获取用户列表
        // getUserList() {
        //     const self = this;
        //     axios.get("/api/v1/users").then(response => {
        //         self.users = response.data;
        //     });
        // },

        //创建组
        createGroup() {
            let self = this;
            self.groupDialogModel.users.push(parseInt(this.$store.getters.LoginData.uid));
            self.$refs["formVaildCreateGroup"].validate(valid => {
                if (valid) {
                    axios
                        .post("/api/portal/createGroup", {
                            groupName: self.groupDialogModel.groupName,
                            users:Array.from(new Set(self.groupDialogModel.users))
                        })
                        .then(function(res) {
                            if (res.data.error == 0) {
                                self.addGroupDialogStatus = false;
                                self.getGroupList("fromCreateGroup");
                                self.groupDialogModel.groupName = "";
                                self.groupDialogModel.users = [];
                            } else {
                                if (res.data.msg == "数据已存在") {
                                    self.$message({
                                        message: "组已存在",
                                        type: "error"
                                    });
                                }
                            }
                        })
                        .catch(res => {
                            this.$message({
                                message: "系统失败",
                                type: "error"
                            });
                        });
                }
            });
        },

        //获取组列表
        getGroupList(type) {
            let self = this;
            axios.get("/api/portal/groupList").then(response => {
                if (response.data.meList.length == 0) {
                    self.topGroupAction = false;
                    self.releasesList = [];
                } else {
                    self.currentItem = response.data.meList[0];
                    self.activeli = response.data.meList[0].id.toString();
                    self.getDetailsList(response.data.meList[0]);
                }

                // if (type == "fromCreateGroup") {
                //     if (response.data.meList.length == 1) {
                //         self.getDetailsList(response.data.meList[0]);
                //         self.currentItem = response.data.meList[0];
                //         self.activeli = response.data.meList[0].id.toString();
                //     }
                // } else {
                //     if (response.data.meList.length == 0) {
                //         self.topGroupAction = false;
                //     }
                //     if (response.data.meList.length > 0) {
                //         self.getDetailsList(response.data.meList[0]);
                //         self.currentItem = response.data.meList[0];
                //         self.activeli = response.data.meList[0].id.toString();
                //     }
                // }
                self.groupList = response.data;
            });
        },

        //获取组列表详情内容
        getDetailsList(item) {
            const self = this;
            self.currentItem = item;
            axios
                .get(
                    "/api/portal/releasesList?page=1&groupId=" +
                         self.currentItem.id
                )
                .then(response => {
                    self.topGroupAction = true;
                    if (response.data.error == 0) {
                        self.releasesList = response.data.releases;
                    }
                })
                .catch(res => {
                    this.$message({
                        message: "系统错误",
                        type: "error"
                    });
                });
        },

        //提交问题
        submitQuestions(questionDialogModel) {
            let self = this;
            self.$refs["formVaildQuestion"].validate(valid => {
                if (valid) {
                    axios
                        .post("/api/portal/releases", {
                            content: self.questionDialogModel.content,
                            groupId: self.currentItem.id,
                            data: []
                        })
                        .then(function(res) {
                            if (res.data.error == 0) {
                                self.questionDialogModel.content = "";
                                self.questionDialogStatus = false;
                                self.getDetailsList(
                                    self.currentItem
                                );
                            }
                        })
                        .catch(res => {
                            this.$message({
                                message: "提出问题异常",
                                type: "error"
                            });
                        });
                }
            });
        },

        //分享想法
        shareIdeas() {
            const self = this;
            console.log(self.currentItem);
            self.$refs["formVaildShareIdea"].validate(valid => {
                if (valid) {
                    axios
                        .post("/api/portal/releases", {
                            content: self.ideaDialogModel.content,
                            groupId: self.currentItem.id,
                            data: self.ideaDialogModel.attachments
                        })
                        .then(function(res) {
                            if (res.data.error == 0) {
                                self.ideaDialogModel.content = "";
                                self.shareIdeaDialogStatus = false;
                                self.getDetailsList(
                                    self.currentItem
                                );
                            }
                        })
                        .catch(res => {
                            this.$message({
                                message: "提出问题异常",
                                type: "error"
                            });
                        });
                }
            });
        },

        handChange(file, fileList) {
            this.ideaDialogModel.attachments = fileList;
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        }
    }
};
</script>

<style lang="scss" scoped> 
.container {
    overflow-y: auto;
    overflow-x: hidden;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

#publicforum {
    width: 1000px;
    margin: 20px auto;
    font-size: 14px;
    .leftnav {
        width: 220px;
        top: 70px;
        bottom: 0px;
        overflow: scroll;
        position: fixed;
        .el-col {
            width: 100%;
            border: none;
        }
        .el-menu {
            border: none;
        }
        .el-menu-item.is-active {
            color: #fff;
            background-color: #e5e0e0 !important;
        }
        .el-menu-item:hover {
            background-color: #e5e0e0 !important;
        }
        .el-submenu .el-menu-item {
            width: 215px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
    .rightcontent {
        margin-left: 250px;
        width: 750px;
        .topgroupmsg {
            padding: 20px 0px 10px 0px;
            border-bottom: 1px solid #ededed;
            z-index: 10;
            position: fixed;
            top: 48px;
            width: 750px;
            background: #fff;
        }
        .nomessage {
            text-align: center;
            line-height: 300px;
            font-size: 20px;
            color: rgb(196, 190, 190);
        }
        .items {
            -webkit-box-flex: 1;
            -ms-flex: 1 1 auto;
            flex: 1 1 auto;
            overflow-y: auto;
        }
        .rowline {
            padding: 25px 0px 25px 0px;
            .content {
                padding: 3px;
                line-height: 23px;
                color: #666;
            }
            .attachs {
                width: 350px;
                // div {
                //     height: 72px;
                //     width: 72px;
                //     background: #ededee;
                //     float: left;
                //     margin-right: 10px;
                //     margin-bottom: 10px;
                // }
            }
            .changehidden {
                padding: 10px;
                cursor: pointer;
                color: #666;
                clear: both;
                span:hover {
                    text-decoration: underline;
                }
            }
            .usercomment .audit {
                position: relative;
                margin-bottom: 10px;
                font-size: 14px;
                -webkit-box-shadow: none;
                box-shadow: none;
                border: 0;
                .avatar {
                    position: absolute;
                    left: 5px;
                    top: 5px;
                    width: 36px;
                    height: 36px;
                }
                .info {
                    margin-left: 60px;
                    display: inline-block;
                    width: calc(100% - 60px);
                    .content {
                        min-height: 32px;
                    }
                }
            }
            .thumbsup {
                padding: 5px;
                text-align: right;
                clear: both;
            }
            .name {
                padding: 5px;
            }
        }
    }
    .addgroup {
        background: #f1f1f1;
        padding: 10px 20px 10px 25px;
        margin-bottom: 10px;
        border-radius: 2px;
        i {
            float: right;
            cursor: pointer;
        }
    }
}
</style>