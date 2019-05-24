<template>
    <div id="app">
        <TopBar />
        <div class="container">
            <Aside />
            <div class="main">
                <div class="main-top"></div>
                <div class="main-container">
                    <div class="leftmenu">
                        <div class="navbtn-list">
                            <div>
                                <div class="navbtn" v-bind:class="{btnactive:userList == false}" @click="userList = false" title="消息">
                                    <i class="iconfont el-icon-news" style="font-size:24px;"></i>
                                </div>
                                <div class="navbtn" v-bind:class="{btnactive:userList == true}" @click="userList = true" title="人员列表"> <i class="iconfont el-icon-qunzu" style="font-size:24px;"></i></div>
                            </div>
                        </div>

                        <!-- 人员列表 -->
                        <div class="main-part" v-show="userList">
                            <div class="main-search">
                                <el-input size="small" placeholder="请输入人员姓名" v-model.trim="searchName" v-on:input="search" prefix-icon="el-icon-search" style="width:230px"></el-input>
                                <!-- <i class="el-icon-plus" @click="dialogVisible = true"></i> -->
                            </div>
                            <div class="main-users">
                                <div v-if="searchNameResult.length == 0">
                                    <el-tree :data="users" :props="defaultProps" @node-click="selectUser">
                                        <span class="custom-tree-node" slot-scope="{ node, data }">
                                            <span v-if="!data.type" style="display:inline-block;width:22px;height:22px; text-align:center; line-height:22px; font-size:12px; background:#ccc;border-radius:50%;color:#FFF" :class="{'onlineavatar':data.online}">{{node.label[0]}}</span>
                                            <span style="font-size:13px;font-weight:bold;color:#666">{{ node.label }}</span>
                                        </span>
                                    </el-tree>
                                    <!--<div :key="organ.id" v-for="organ in users" style="position:relative" >-->
                                    <!--<div class="organname" @click="setUserShow(organ)">{{organ.name}}-->
                                        <!--<i class="el-icon-arrow-left" v-show="!organ.status" style="float:right;color:rgb(0, 90, 158)"></i>-->
                                        <!--<i class="el-icon-arrow-down" v-show="organ.status" style="float:right;color:rgb(0, 90, 158)"></i></div>-->
                                    <!--<el-collapse-transition>-->
                                        <!--<div v-show="organ.status">-->
                                            <!--<div class="transition-box user" :key="user.id" :class="{active:toUser.id==user.id}" v-show="!user.hideCurrent" v-for="user in organ.users" @click="selectUser(user)" style="position:relative">-->
                                                <!--<span style="display:inline-block;width:22px;height:22px; text-align:center; line-height:22px; font-size:12px; background:#ccc;border-radius:50%;color:#FFF" :class="{'onlineavatar':user.online}">{{user.name[0]}}</span>-->
                                                <!--<span class="name" style="font-size:13px;font-weight:bold;color:#666">{{user.name}}</span>-->
                                            <!--</div>-->
                                        <!--</div>-->
                                    <!--</el-collapse-transition>-->
                                <!--</div>-->
                                </div>
                                <div  v-if="searchNameResult.length > 0">
                                <div class="user" :key="user.id" v-for="user in searchNameResult" @click="selectUser(user)" style="position:relative">
                                    <span style="display:inline-block;width:22px;height:22px; text-align:center; line-height:22px; font-size:12px; background:#ccc;border-radius:50%;color:#FFF" :class="{'onlineavatar':user.online}">{{user.name[0]}}</span>
                                    <span class="name" style="font-size:13px;font-weight:bold;color:#666">{{user.name}}</span>
                                </div>
                                </div>
                            </div>
                        </div>
                        <!-- 对话列表 -->
                        <div class="main-part" v-show="!userList">
                            <div class="main-search">
                                <el-input size="small" placeholder="请输入对话人姓名" v-model.trim="dialogName" v-on:input="searchDialogName()" prefix-icon="el-icon-search">
                                </el-input>
                                <i class="el-icon-plus" @click="dialogVisible = true"></i>
                            </div>
                            <div class="main-users">
                                 <!-- @contextmenu.prevent="deleteCurrentDialog(user,index)" -->
                                <div class="user dialog-user" :key="user.uid"  v-for="(user,index) in dialogList" @click="selectDialog(user)" :class="{active:toUser.id == user.id}" v-show="!user.hideCurrent" v-if="user.name || user.groupName">
                                    <span style="display:inline-block;width:25px; height:25px; color:#FFF; font-size:13px; text-align:center;line-height:25px;background:#ccc;border-radius:50%" :class="{'onlineavatar':user.online || user.groupId}">{{user.name?user.name[0]:""}}</span>
                                    <span class="name" style="font-weight:bold;font-size:13px;" v-if="user.name">{{user.name}}</span>
                                    <span class="newMessageIcon" v-if="user.newMessageIcon">
                                        <i class="iconfont el-icon-dian"></i>
                                    </span>
                                     <!-- <span class="newMessageIcon">
                                        <i class="el-icon-error"></i>
                                    </span> -->
                                </div>
                                <div v-show="dialogList.length == 0" class="emptytips">
                                    当前对话列表为空！
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧对话框 -->
                    <div class="main-messages" v-if="toUser">
                        <div class="nomessages" v-show="dialogList.length == 0">
                            <i class="iconfont el-icon-duihua"></i>
                        </div>
                        <div class="top" v-show="dialogList.length > 0">
                            <div class="topmsg">
                                <span style="display:inline-block;width:25px;height:25px;background:#ccc; text-align:center; line-height:25px; color:#FFF; font-size:13px; border-radius:50%" :class="{'onlineavatar':toUser.online || toUser.groupId}" v-if="toUser.name">{{toUser.name[0]}}</span>
                                <span class="name" style="font-weight:bold;font-size:13px;">{{toUser.name}}</span>
                                <span class="name" style="font-size:13px;" v-if="toUser.groupMembers">{{toUser.groupMembers}}</span>
                                <span class="name" style="font-size:13px;" v-if="toUser.uidList">{{toUser.uidList | filterName(arrGroupUsers)}}</span>
                            </div>
                        </div>
                        <div class="messages" id="messages" v-show="dialogList.length > 0">
                            <div v-for="item in msgList" :key="item.id" style="margin-top:10px;">
                                <el-row v-if="item.from != currentUserId">
                                    <el-col :span="1">
                                        <div class="grid-content bg-purple">
                                            <div style="text-align:center;position:relative">
                                               
                                                <span style="display:inline-block;width:25px;height:25px; color:#FFF; font-size:13px; line-height:25px;background:#ccc;border-radius:50%" :class="{'onlineavatar':toUser.online || toUser.groupId}" v-if="item.from_info && !item.groupId">{{item.from_info.name[0]}}</span>
                                                <span style="display:inline-block;width:38px;height:38px;  color:#FFF; font-size:12px; line-height:38px;background:#ccc;border-radius:50%" :class="{'onlineavatar':toUser.online || toUser.groupId}" v-if="item.from_info && item.groupId">{{item.from_info.name}}</span>
                                                <!-- {{item}} -->
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="18">
                                        <div class="grid-content bg-purple" style="padding-left:15px; position:relative">
                                            <i class="el-icon-caret-left" style="position:absolute; left:5px;color:#ebdbdb; margin-top:10px; font-size:14px;margin-right:-5px;"></i>
                                            <div class="dusslist" v-if="item.type == 'word' || !item.type">
                                                {{item.msg}}
                                            </div>
                                           
                                            <div class="dusslist" v-if="item.type == 'doc'" style="padding-top:15px; padding-left:15px;height:162px">
                                               <FilesOperate  :item="JSON.parse(item.msg)" :options="{preview:true,download:true}"></FilesOperate>
                                            </div>
                                            <div class="msgtime">
                                                <div>{{item.time | reInitTime}}</div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row type="flex" justify="end" v-if="item.from == currentUserId" :key="item.id">
                                    <el-col :span="18">
                                        <div class="grid-content bg-purple" style="padding-right:10px;position:relative; text-align:right">
                                            
                                            <i class="el-icon-caret-right" style=" position:absolute; right:2px; color:#ebdbdb; font-size:14px; color:#c7e0f4;  margin-top:10px"></i>
                                            <div class="dusslist fromme"  v-if="item.type == 'word' || !item.type"> 
                                               <span style="text-align:left;display:inline-block"> {{item.msg}}</span>
                                            </div>
                                            <div class="dusslist fromme"  v-if="item.type == 'doc'" style="padding-top:15px;padding-left:15px;height:162px">
                                                    <FilesOperate  :item="JSON.parse(item.msg)" :options="{preview:true,download:true}"></FilesOperate>
                                            </div>
                                             <div class="msgtime msgtime_right">
                                                <div>{{item.time | reInitTime}}</div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="1">
                                        <div class="grid-content bg-purple">
                                            <div style="text-align:center;position:relative">
                                                <span style="display:inline-block;width:25px;height:25px;text-align:center; color:#FFF; line-height:25px; font-size:13px; background:#ccc;border-radius:50%" :class="{'onlineavatar':true}" v-if="item.from_info && !item.groupId">{{item.from_info.name[0]}}</span>
                                                 <span style="display:inline-block;width:38px;height:38px;  color:#FFF; font-size:12px; line-height:38px;background:#ccc;border-radius:50%" :class="{'onlineavatar':toUser.online || toUser.groupId}" v-if="item.from_info && item.groupId">{{item.from_info.name}}</span>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                        <div class="textarea" v-show="dialogList.length > 0">
                            <div style="padding:5px;">
                                <el-upload  name="files" style="display:inline" ref="upload" :on-success="handleSuccess"  :on-progress="previewAttach" action="/api/v1/files/upload" multiple :with-credentials="true" :show-file-list="false">
                                     <i class="el-icon-picture" style="font-size:18px"></i>
                                </el-upload>
                                    &nbsp;
                                  <el-popover
                                    placement="top"
                                    width="260"
                                >

                                    <div class="emoji">
                                        <ul>
                                            <li v-for="item in emoji" :key="item" @click="addemoji(item)">
                                                {{item}}
                                            </li>
                                        </ul>
                                       
                                    </div>
                                     <i slot="reference" class="iconfont el-icon-Ovalx" style="font-size:16px"></i>
                                    </el-popover>
                            </div>
                            <el-input type="textarea" v-model.trim="content" :rows="2" @keyup.enter.native="onSubmit"></el-input>
                            <el-button type="primary" @click="onSubmit" style="margin-top:10px;width:100px;">发送</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="新建组" :visible.sync="dialogVisible" align="left" :close-on-click-modal="false" width="700px">

            <div style="padding-left:35px;">
                <el-form :model="rows" :rules="rules" ref="formsubmit">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item prop="groupName">
                                <el-input v-model="rows.groupName" placeholder="请填写组名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <br />
            <template>
                <el-transfer filterable :titles="['人员列表', '已选列表']" :props="{  key: 'id',label: 'name'}" filter-placeholder="请输入姓名" v-model="groupUsers" :data="arrGroupUsers" style="width:500px;margin:auto">
                </el-transfer>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveFormValidate()">确定</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>
import Aside from "@/components/Aside.vue";
import TopBar from "@/components/TopBar.vue";
import axios from "@/plugins/axios";
import FilesOperate from "@/apps/FilesOperate.vue";
import { Loading } from "element-ui";
import moment from "moment";

export default {
    name: "webim",
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            msgList: [],
            dialogList: [],
            content: "",
            users: [],
            toUser: {},
            userList: false,
            dialogVisible: false,
            arrGroupUsers: [],
            groupUsers: [],
            createGroup_id: "",
            searchName: "",
            searchNameResult: [],
            dialogName: "",
            currentPage: 0,
            countpage: 1,
            emoji:['😃','😄','👿','😉','😊','😌','😍','😏','😒','😓','😔','😖','😘','😚','😜','😝','😞','😠','😡','😢','😣','😥','😨','😪','😭','😰','😱','😲','😳','😷'],
            rows: {
                groupName: ""
            },
            rules: {
                groupName: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请填写组名称"
                    }
                ]
            }
        };
    },
    components: {
        Aside,
        TopBar,
        FilesOperate
    },
    // sockets: {
    //     connect() {
    //         console.log("soket connect... ");
    //     },
    //     message(value) {
    //         console.log(value);
    //         //离线消息
    //         let self = this;
    //         if (Array.isArray(value)) {
    //             for (let item of value) {
    //                 self.addDussList(item, "fromMessage");
    //                 self.addMessageToMsgList(item);
    //             }
    //         } else {
    //              console.log(this.dialogList);
    //              if(this.dialogList.length > 0){
    //                 self.addMessageToMsgList(value);
    //              }
    //              self.addDussList(value, "fromMessage");
    //             // if (value.from != this.$store.getters.LoginData.uid) {
    //             //     this.open(value);
    //             // }
    //         }
    //     },
    //     receiveMsg(data) {
    //         this.createGroupObj = data;
    //     },
    //     groupList(data) {
    //         console.log(data);
    //     },
    //     online(message) {
    //         let self = this;
    //         if(message){
    //         setTimeout(function() {
    //             if (typeof message == "string") {
    //                 self.compareDialogUserOnline(message, true);
    //             } else {
    //                 for (let id of message) {
    //                     self.compareDialogUserOnline(id, true);
    //                 }
    //             }
    //         }, 1000);
    //         }
    //     },
    //     offline(id) {
    //         this.compareDialogUserOnline(id);
    //     }
    // },
    filters: {
        filterName: function(ids, users) {
            if (users && ids) {
                var arr = [];
                for (let user of users) {
                    for (let id of ids) {
                        if (user.id == id) {
                            arr.push(user.name);
                        }
                    }
                }
                if (arr.length > 10) {
                    arr = arr.splice(0, 10);
                }
                return "(" + arr.join(",") + ")";
            }
        },
        filterDocument: function(data) {
            if (data.indexOf("isSendDoc") > -1) {
                return JSON.parse(data);
            } else {
                return data;
            }
        },
        reInitTime: function(data) {
            
           if(moment(new Date()).format('YYYY-MM-DD') == moment(data).format('YYYY-MM-DD')){
               return "今天 " +  moment(data).format('HH:mm')
           }else if(moment(new Date()).add(-1, 'days').format('YYYY-MM-DD') == moment(data).format('YYYY-MM-DD')){
                return "昨天 " +  moment(data).format('HH:mm')
           }else{
                return moment(data).format('MM-DD HH:mm');
           }
        }
    },
    methods: {
        addemoji(data){
            this.content =  this.content + data;
        },
        deleteCurrentDialog(data,index) {
            let self = this;
            self.$confirm("确定要删除该对话框吗?", "提示", {
                type: "warning"
            }).then(() => {
                axios
                    .get("/api/v1/im/dialoguser/delete/"+data.id)
                    .then(res => {
                       if(res.data.error == 0){
                           this.dialogList.splice(index,1);
                            self.$message({
                                message: "删除成功",
                                type: "success"
                            });
                       }
                      
                    })
                    .catch(function(res) {
                        self.$message({
                            message: "操作失败",
                            type: "error"
                        });
                    });
            });
        },
        handleSuccess(data, file, fileList) {
            this.content = JSON.stringify(data[0]);
            this.onSubmit();
            // this.$confirm("是否要发送此文件?", "提示", {
            //     type: "warning"
            // }).then(() => {
            //     this.content = JSON.stringify(data[0]);
            //     this.onSubmit();
            // });
        },
        previewAttach(data) {
              console.log(data);
        },

        
        
        // open(data) {
        //     const h = this.$createElement;
        //     let type = data.groupId ? "群" : "个人";
        //     let message = data.from_info.name + "发来的" + type + "消息";
        //     this.$notify({
        //         title: message,
        //         type: "success",
        //         duration: "2000",
        //         message: h("i", { style: "color: teal" }, data.msg)
        //     });
        // },
        setUserShow(organ) {
            if (organ.status) {
                this.$set(organ, "status", false);
            } else {
                this.$set(organ, "status", true);
            }
        },
        saveFormValidate() {
            this.$refs["formsubmit"].validate(valid => {
                if (valid) {
                    if (this.groupUsers.length > 0) {
                        this.createGroup();
                    } else {
                        this.$message({
                            message: "请选择组成员",
                            type: "warning"
                        });
                    }
                }
            });
        },
        search() {
            if (this.searchName) {
                let user_arr = [];
                this.searchNameResult = [];
                for (let item of this.users) {
                    for (let item_user of item.users) {
                        if (item_user.name.indexOf(this.searchName) > -1) {
                            user_arr.push(JSON.stringify(item_user));
                        }
                    }
                }
                user_arr = Array.from(new Set(user_arr));
                for (let item of user_arr) {
                    this.searchNameResult.push(JSON.parse(item));
                }
            } else {
                this.searchNameResult = [];
            }
        },
        searchDialogName() {
            if (this.dialogName) {
                for (let item of this.dialogList) {
                    if (item.name.indexOf(this.dialogName) > -1) {
                        this.$set(item, "hideCurrent", false);
                    } else {
                        this.$set(item, "hideCurrent", true);
                    }
                }
            } else {
                for (let item of this.dialogList) {
                    this.$set(item, "hideCurrent", false);
                }
            }
        },
        compareDialogUserOnline(id, status) {
            if (id) {
                for (let item of this.users) {
                    for (let user of item.users) {
                        if (user.id == id) {
                            if (status) {
                                this.$set(user, "online", true);
                            } else {
                                this.$set(user, "online", false);
                            }
                        }
                    }
                }
            }
            if (this.dialogList.length > 0) {
                let self = this;
                for (let item of self.dialogList) {
                    if (item.uid == id) {
                        if (status) {
                            self.$set(item, "online", true);
                        } else {
                            self.$set(item, "online", false);
                        }
                    }
                }
            }
        },
        createGroup() {
            let self = this;
            self.groupUsers.push(parseInt(self.$store.getters.LoginData.uid));
            self.groupUsers = Array.from(new Set(self.groupUsers));
            self.socket.emit("addgroup", {
                groups: self.groupUsers.join(","),
                groupName: self.rows.groupName
            });
            setTimeout(function() {
                if (self.createGroupObj) {
                    //给id为了匹配toUser
                    self.createGroupObj.id = self.createGroupObj.groupId;
                    self.createGroupObj.name = self.rows.groupName;
                    //self.toUser = self.createGroupObj;
                    self.createGroupObj.uid = self.createGroupObj.id;
                    self.addDussList(self.createGroupObj);
                    self.rows.groupName = "";
                }
            }, 200);
            self.dialogVisible = false;
        },
        addMessageToMsgList(message) {
            if (this.toUser.uid == message.from && !message.groupId) {
                if (message.msg.indexOf("isSendDoc") > -1) {
                    message["isSendDoc"] = JSON.parse(message.msg).isSendDoc;
                    message.msg = "";
                }
                this.msgList.push(message);
            }

            if (
                message.from == this.$store.getters.LoginData.uid ||
                this.toUser.uid == message.groupId
            ) {
                if (message.msg.indexOf("isSendDoc") > -1) {
                    message["isSendDoc"] = JSON.parse(message.msg).isSendDoc;
                    message.msg = "";
                }
                console.log(this.dialogList);
                this.msgList.push(message);
            }
            for (let item of this.dialogList) {
                if (item.uid == message.from && !message.groupId) {
                    this.$set(item, "newMessageIcon", true);
                }
                if (item.uid == message.groupId) {
                    this.$set(item, "newMessageIcon", true);
                }
            }
            this.$nextTick(() => {
                var messages = this.$el.querySelector("#messages");
                messages.scrollTop = messages.scrollHeight;
            });
        },
        selectUser(user) {
            if(!user.type){
                user.uid = user.id;
                this.toUser = user;
                this.currentPage = 0;
                this.countpage = 1;
                this.msgList = [];
                this.getPerDialogHistory({ uid: user.id });
                this.addDussList(this.toUser);
            }
        },
        selectDialog(user) {
            this.$set(user, "newMessageIcon", false);
            user.id = user.uid;
            this.toUser = user;
            this.currentPage = 0;
            this.countpage = 1;
            this.msgList = [];
            this.getPerDialogHistory(user);
        },
        addDussList(user, fromMessage) {
            if (fromMessage) {
                let canPush = true;
                if (this.dialogList.length > 0) {
                    for (let item of this.dialogList) {
                        if (user.groupId) {
                            if (item.uid == user.groupId) {
                                canPush = false;
                            }
                        } else {
                            if (item.uid == user.from) {
                                canPush = false;
                            }
                        }
                    }
                    if (canPush) {
                        if (user.groupId) {
                            user.name = user.groupName;
                            user.uid = user.id = user.groupId;
                            this.$set(user, "newMessageIcon", true);
                            this.$set(user, "online", true);
                            this.dialogList.push(user);
                        } else {
                            if (
                                user.from != this.$store.getters.LoginData.uid
                            ) {
                                user.name = user.from_info.name;
                                user.uid = user.id = user.from;
                                this.$set(user, "newMessageIcon", true);
                                this.$set(user, "online", true);
                                this.dialogList.push(user);
                            }
                        }
                    }
                } else {
                    user.name = user.from_info.name;
                    user.uid = user.id = user.from;
                    this.$set(user, "newMessageIcon", true);
                    this.$set(user, "online", true);
                    this.toUser = user;
                    this.getPerDialogHistory(user);
                    this.dialogList.push(user);
                }
            } else {
                let canPush = true;
                if (this.dialogList.length > 0) {
                    for (let item of this.dialogList) {
                        if (item.uid == user.uid) {
                            canPush = false;
                        }
                    }
                }
                if (canPush) {
                    this.dialogList.push(user);
                    if (this.dialogList.length == 1 && user.groupId) {
                        this.selectDialog(user);
                    }
                }
            }
        },

        onSubmit() {
            if (this.content.replace(/\s+/g, "")) {
                this.$nextTick(() => {
                    var messages = this.$el.querySelector("#messages");
                    messages.scrollTop = messages.scrollHeight;
                });
                if (this.toUser.id.toString().indexOf("group") > -1) {
                    this.socket.emit("send", {
                        msg: this.content,
                        to: 0,
                        from: this.$store.getters.LoginData.uid,
                        groupId: this.toUser.id,
                        type:
                            this.content.indexOf("iconUrl") > -1
                                ? "doc"
                                : "word"
                    });
                } else {
                    this.socket.emit("send", {
                        msg: this.content,
                        to: this.toUser.id,
                        from: this.$store.getters.LoginData.uid,
                        type:
                            this.content.indexOf("iconUrl") > -1
                                ? "doc"
                                : "word"
                    });
                }
                this.content = "";
            }
        },
        getUsers() {
            axios.get("/api/v1/users").then(res => {
                this.arrGroupUsers = res.data;
            });

            axios.get("/api/v1/users/list/organs").then(res => {
                this.users = res.data;
            });
        },
        getUserName(id, currentItem) {
            if (currentItem[0].groupId) {
                return currentItem[0].groupName;
            } else {
                for (let item of this.arrGroupUsers) {
                    if (item.id == id) {
                        return item.name;
                    }
                }
            }
        },
        getPerDialogHistory(user) {
            let self = this;
            let data = {};
            self.currentPage++;
            if (user.groupId) {
                data = { groupId: user.groupId, page: self.currentPage };
            } else {
                data = { to: user.uid, page: self.currentPage };
            }

            if (self.countpage < self.currentPage) {
                return false;
            }
            let messages = this.$el.querySelector("#messages");
            let loadingDialog = Loading.service({ target: messages });
            if (data.groupId || data.to) {
                axios
                    .post("/api/v1/im/message/list", data)
                    .then(res => {
                        self.countpage = res.data.count;
                        for (let item of res.data.chatRecords) {
                            if (item.msg.indexOf("isSendDoc") > -1) {
                                item["isSendDoc"] = JSON.parse(
                                    item.msg
                                ).isSendDoc;
                                item.msg = "";
                            }
                        }
                        self.msgList = res.data.chatRecords.concat(
                            self.msgList
                        );
                        self.$nextTick(() => {
                            loadingDialog.close();
                            messages.scrollTop = "100";
                        });
                    })
                    .catch(function() {
                        self.$message({
                            message: "获取消息失败",
                            type: "error"
                        });
                    });
            }
        },
        getDialogUser() {
            let self = this;
            axios
                .post("/api/v1/im/messages/users")
                .then(res => {
                    if (res.data.userList.length > 0) {
                        // let hash = {};
                        // res.data.userList = res.data.userList.reduce((preVal, curVal) => {
                        //     hash[curVal.uid]
                        //         ? ""
                        //         : (hash[curVal.uid] =
                        //               true && preVal.push(curVal));
                        //     return preVal;
                        // }, []);
                        for (let item of res.data.userList) {
                            if (item.groupId) {
                                item.name = item.groupName;
                                item.id = item.uid = item.groupId;
                                this.getGroupMembers(item);
                            } else {
                                item.id = item.uid;
                            }
                        }
                        self.toUser = res.data.userList[0];
                        self.getPerDialogHistory(res.data.userList[0]);
                        self.dialogList = res.data.userList;
                    }
                })
                .catch(function() {
                    self.$message({
                        message: "获取对话列表失败",
                        type: "error"
                    });
                });
        },

        getGroupMembers(item) {
            axios
                .post("/api/v1/im/group/info", { groupId: item.groupId })
                .then(res => {
                    let arr = [], boole = false;
                    if(res.data.data.groups.length > 15){
                         boole = true;
                         res.data.data.groups = res.data.data.groups.slice(0,15);
                    }
                    for (let item of res.data.data.groups) {
                        arr.push(item.name);
                    }
                    item.groupMembers = boole ? "(" + arr.join(",") + "...)" : "(" + arr.join(",") + ")" ;
                })
                .catch(function() {});
        }
    },

    mounted() {
        this.getUsers();
        this.getDialogUser();
        this.currentUserId = this.$store.getters.LoginData.uid;
        // this.$socket.emit("offLine");
        // this.$socket.emit("join", this.$store.getters.LoginData.uid);
        // let url = "http://172.16.3.17";
        // if (process.env.NODE_ENV === 'production') {
        //     url = 'http://172.16.3.17';
        // } else {
        //     url = 'http://192.168.1.29:10988';
        //    // url = "http://59.110.172.228:10988";
        // }
        // this.socket = io(url);
        // this.socket.on('connect',data=>{
        //     console.log('soket connect...');
        // });
        //this.socket.emit("offLine");
        //this.socket.emit("join", this.$store.getters.LoginData.uid);
        this.socket.emit("offLine");
        this.socket.emit("join", this.$store.getters.LoginData.uid);
        this.socket.on("message", value => {
            console.log(value);
            let self = this;
            if (Array.isArray(value)) {
                for (let item of value) {
                    self.addDussList(item, "fromMessage");
                    self.addMessageToMsgList(item);
                }
            } else {
                if (self.dialogList.length > 0) {
                    self.addMessageToMsgList(value);
                }
                self.addDussList(value, "fromMessage");
                // if (value.from != this.$store.getters.LoginData.uid) {
                //     this.open(value);
                // }
            }
        });

        this.socket.on("receiveMsg", data => {
            this.createGroupObj = data;
        });
        this.socket.on("groupList", data => {
            console.log(data);
        });

        this.socket.on("online", message => {
            let self = this;
            if (message) {
                setTimeout(function() {
                    if (typeof message == "string") {
                        self.compareDialogUserOnline(message, true);
                    } else {
                        if (message.length > 0) {
                            for (let id of message) {
                                self.compareDialogUserOnline(id, true);
                            }
                        }
                    }
                }, 1000);
            }
        });

        this.socket.on("offline", id => {
            this.compareDialogUserOnline(id);
        });

        let self = this;
        let messages = this.$el.querySelector("#messages");
        messages.addEventListener("scroll", function() {
            if (messages.scrollTop == 0) {
                self.getPerDialogHistory(self.toUser);
            }
        });
    }
};
</script>

<style lang="scss" scoped>


.main {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #f4f4f4;
    .el-transfer {
        width: 500px;
        margin: auto;
    }
    .main-top {
        flex: 0 0 auto;
        background: #f4f4f4;
        height: 40px;
        border-bottom: 1px solid #eaeaea;
        padding-left: 10px;
    }
    #pane-first {
        flex: 0 0 auto;
        overflow: scroll;
        -webkit-box-flex: 0;
    }
    .main-container {
        background: #ededed;
        display: flex;
        flex: 1 1 auto;
        height: 100%;
        .leftmenu {
            display: flex;
            width: 300px;
            border-right: 1px solid #eaeaea;
        }
        .main-part {
            width: 250px;
            border-right: 1px solid #dfdddd;
            display: flex;
            flex-direction: column;
            background: #fff;
            .hideCurrent {
                display: none;
            }
        }
        .main-search {
            height: 100px;
            width: 100%;
            flex: 0 0 auto;
            -webkit-box-flex: 0;
            height: 57px;
            border-bottom: 1px solid #dfdddd;
            .el-input {
                margin: 10px;
                width: 210px;
            }
        }
        .main-users {
            flex: 1 1 auto;
            overflow: auto;
            -webkit-box-flex: 1;
            height: 100%;
            padding-bottom: 50px;
            .emptytips {
                text-align: center;
                line-height: 200px;
                font-size: 13px;
                color: #c0b8b8;
            }
            .organname {
                padding: 10px;
                font-weight: bold;
                cursor: pointer;
                font-size: 13px;
            }
            .onlineavatar {
                background: #3b97dd !important;
            }
            .user {
                // display: flex;
                justify-content: flex-start;
                align-items: center;
                // height: 40px;

                padding: 5px 0px 5px 20px;
                border-bottom: 1px solid #f9f1f1;
                cursor: pointer;
                .name {
                    margin-left: 10px;
                }
                .onlineavatar {
                    background: #3b97dd !important;
                }
            }
            .dialog-user {
                position: relative;
                img {
                    display: block;
                    left: 10px;
                    top: 7px;
                    position: absolute;
                }
                .newMessageIcon {
                    float: right;
                    display: inline-block;
                    margin-right: 20px;
                    i {
                        font-family: 18px;
                        color: rgb(204, 72, 72);
                    }
                }
                h5 {
                    margin: 0px;
                    line-height: 45px;
                }
            }
            .active {
                background: #c7e0f4;
            }
        }

        .navbtn-list {
            border-right: 1px solid #dfdddd;
            border-left: 1px solid #dfdddd;
            overflow: auto;
            .user {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                height: 40px;
                padding-left: 20px;
                border-bottom: 1px solid #eaeaea;
                cursor: pointer;
                .name {
                    margin-left: 10px;
                }
            }
            .navbtn {
                padding: 10px 10px;
                color: #fff;
                i {
                    color: rgba(0, 90, 158, 0.6);
                }
            }
            .btnactive {
                i {
                    color: rgb(0, 90, 158);
                }
            }
            .active {
                background: #c7e0f4;
            }
        }
        .main-messages {
            width: 60%;
            display: flex;
            flex-direction: column;
            background: #fff;
            .nomessages {
                text-align: center;
                line-height: 28;
                i {
                    font-size: 68px;
                    color: #c0b8b8;
                }
            }

            .messages {
                flex: 1 1 auto;
                padding: 5px 23px 0px 23px;
                overflow: scroll;
                overflow-x: hidden;
                font-family: "Emoji";
                .onlineavatar {
                    background: #3b97dd !important;
                }
                .msgtime{
                    div{
                        -webkit-transform: scale(0.9);
                        -webkit-transform-origin: left top;
                         font-size: 11px;
                         color: #a7a4a4;
                         margin-top: 2px;
                    }
                }
                .msgtime_right{
                    div{
                        -webkit-transform-origin: right top;
                    }  
                }
            }
            .textarea {
                flex: 0 0 auto;
                height: 150px;
                padding: 0 30px;
                margin-top: 20px;
                font-family: "Emoji"
                
            }
            .top {
                flex: 0 0 auto;
                height: 55px;
                padding: 0 30px;
                border-bottom: 1px solid #ededed;
                .topmsg {
                    height: 35px;
                    margin: 10px 0px;
                    align-items: center;
                    display: flex;
                    position: relative;
                    .onlineavatar {
                        background: #3b97dd !important;
                    }
                    .name {
                        margin-left: 5px;
                    }
                    .name_uidList {
                        margin-left: 10px;
                        font-size: 13px;
                        display: inline-block;
                        width: 300px;
                        overflow: hidden;
                        word-break: keep-all;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
            .dusslist {
                line-height: 32px;
                display: inline-block;
                border: 1px solid #ededed;
                padding: 0px 5px;
                border-radius: 5px;
                background: #ebdbdb;
                min-width: 30px;
            }
            .fromme {
                background: #c7e0f4;
                text-align: right;
            }
            .attachments {
                margin: 0px;
            }
        }
    }
}
</style>
