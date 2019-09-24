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
                                    <div :key="index" v-for="(organ,index) in users" style="position:relative" >
                                        <div class="organname" @click="setUserShow(organ)">{{organ.name}}
                                            <i class="el-icon-arrow-left" v-show="!organ.status" style="float:right;color:rgb(0, 90, 158)"></i>
                                            <i class="el-icon-arrow-down" v-show="organ.status" style="float:right;color:rgb(0, 90, 158)"></i></div>
                                        <el-collapse-transition>
                                            <div v-show="organ.status">
                                                <div class="transition-box user" :key="index" :class="{active:(index+user.id) == userIndex}" v-show="!user.hideCurrent" v-for="(user,index) in organ.users" @click="selectUser(user,index)" style="position:relative">
                                                    <span class="avatar" :class="{'onlineavatar':user.online}">{{user.name[0]}}</span>
                                                    <span class="name">{{user.name}}</span>
                                                </div>
                                            </div>
                                        </el-collapse-transition>
                                    </div>
                                </div>
                                <!-- //搜索出的人员列表 -->
                                <div  v-if="searchNameResult.length > 0">
                                <div class="user" :key="user.id" v-for="user in searchNameResult" @click="selectUser(user)" style="position:relative">
                                    <span  class="avatar" :class="{'onlineavatar':user.online}">{{user.name[0]}}</span>
                                    <span class="name">{{user.name}}</span>
                                </div>
                                </div>
                            </div>
                        </div>
                        <!-- 对话列表 -->
                        <div class="main-part" v-show="!userList">
                            <div class="main-search">
                                <el-input size="small" placeholder="请输入对话人姓名" v-model.trim="dialogName" v-on:input="searchDialogName()" prefix-icon="el-icon-search">
                                </el-input>
                                <i class="el-icon-plus" @click="showAddGroup" title="创建群组"></i>
                            </div>
                            <div class="main-users">
                                <div class="user dialog-user" :key="index"  v-for="(user,index) in getUserConversation.conversations" @click="selectDialog(user,index)" v-if="!user.hideCurrentDialog" :class="{active:index == userDialogIndex}">
                                    <p style="margin:0" v-if="!user.gid" @contextmenu.prevent="upDataUserConversations(user)">
                                        <!-- {{user.unread_msg_count}} -->
                                        <span class="avatar">{{user.nickName ? user.nickName[0]:""}}</span>
                                        <span class="name"  v-if="user.nickName">{{user.nickName}}</span>
                                        <span class="onlineavatar" v-if="user.unread_msg_count > 0">
                                            {{user.unread_msg_count}}
                                        </span>
                                    </p>
                                    <!--新建群组时候像对话框添加群组 -->
                                    <p style="margin:0" v-if="user.gid">
                                        <span class="avatar" style="background:#005a9e;color:#FFF">群</span>
                                        <span class="name">{{user.name}}</span>
                                        <span class="onlineavatar" v-if="user.unread_msg_count > 0">
                                            {{user.unread_msg_count}}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>




                    <!-- 右侧对话框 -->
                    <div class="main-messages">
                            <div class="nomessages" v-if="!toUser">
                                <i class="iconfont el-icon-duihua"></i>
                            </div>
                            <div class="top"  v-if="toUser">
                                <div class="topmsg" :class="{avatarActive:true}" v-cloak>
                                    <span class="avatar">{{toUser.gid ? '群' : toUser.nickName[0]}}</span>
                                    <span class="name">{{toUser.nickName}}</span>
                                    <el-popover v-if="toUser.gid"
                                    style="position:absolute;right:0px;top:3px"
                                        placement="bottom"
                                        width="160"
                                        trigger="click"
                                        >
                                        <div  class="groupMembers">
                                             <div v-for="(user,index) in groupMembers" :key="index" class="members">
                                                 {{user.nickName}} <span v-if="user.flag == 1" style="font-size；12px">(群主)</span>  <i class="icon-name el-icon-delete" title="删除成员" v-if="loginUserHasGroup == '1' && user.flag == 0" @click="deleteGroupUser(user,index)"></i>
                                                <i class="icon-name el-icon-plus" title="添加成员" v-if="loginUserHasGroup == '1' && user.flag == 1" @click="addNewGroupMerbers()"></i>
                                            </div>
                                        </div>
                                         
                                        <el-button slot="reference" type="mini">群成员</el-button>
                                    </el-popover>
                                    <el-button slot="reference" type="mini" style="position:absolute;right:80px;top:3px" v-if="loginUserHasGroup == '1'" @click="dissolveGroup()">解散群</el-button>
                                     <el-button slot="reference" type="mini" style="position:absolute;right:80px;top:3px" v-if="loginUserHasGroup == '2'" @click="exitGroup()">退出群</el-button>
                                </div>
                            </div>
                            <div class="messages" id="messages"  v-if="toUser">
                                <div v-for="item in msgList" :key="item.msg_id">
                                     <div class="fromeMe moveLeft" v-if="item.content.from_id != currentUserId" :class="{groupAvatarLeft:toUser.gid}">
                                        <div class="wordcontent">
                                            <span v-if="!item.content.msg_body.extras" v-html="item.content.msg_body.text" class="wordwz"></span>
                                            <div v-if="item.content.msg_body.extras" class="attach">
                                                <FilesOperate :item="item" :options="{preview:true,download:true}" v-for="item in item.content.msg_body.extras" :key="item.id"></FilesOperate>
                                            </div>
                                        </div>
                                        <div style="font-size:12px;color:#c0bdbd;padding-top:3px">{{item.content.create_time | reInitTime}}</div>
                                        <div class="avatar">
                                                <span v-if="!toUser.gid">
                                                    {{item.content.from_name ? item.content.from_name[0] : currentUserName[0] }}
                                                </span>
                                                <span v-if="toUser.gid">
                                                    {{item.content.from_name ? item.content.from_name : currentUserName }}
                                                </span>
                                                <i  class="el-icon-caret-left"></i>
                                        </div>
                                      </div>

                                      <div class="fromeMe moveRight" v-if="item.content.from_id == currentUserId" :class="{groupAvatarRight:toUser.gid}">
                                          <div class="wordcontent">
                                            <span v-if="!item.content.msg_body.extras" v-html="item.content.msg_body.text" class="wordwz"></span>
                                            <div v-if="item.content.msg_body.extras" class="attach">
                                                 <FilesOperate :item="item" :options="{preview:true,download:true}" v-for="item in item.content.msg_body.extras" :key="item.id"></FilesOperate>
                                            </div>
                                          </div>
                                          <div style="font-size:12px;color:#c0bdbd;padding-top:3px">{{item.content.create_time | reInitTime}}</div>
                                        <div class="avatar">
                                            <span v-if="!toUser.gid">
                                                {{item.content.from_name ? item.content.from_name[0] : currentUserName[0] }}
                                            </span>
                                            <span v-if="toUser.gid">
                                                {{item.content.from_name ? item.content.from_name : currentUserName }}
                                            </span>
                                            <i  class="el-icon-caret-right"></i>
                                        </div>
                                      </div>
                                </div>
                            </div>
                            <div style="padding:30px 30px 5px 30px"  v-if="toUser">
                                  <el-popover placement="top" width="360">
                                    <div class="emoji" >
                                        <ul>
                                            <li v-for="item in emoji" :key="item" @click="addemoji(transferEmoji(item))"  v-html="transferEmoji(item)">
                                             </li>
                                        </ul>
                                    </div>
                                     <i slot="reference" class="iconfont el-icon-Ovalx"  @click="resetEmoji()" style="font-size:16px"></i>
                                    </el-popover>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                <el-upload  name="files" style="display:inline" ref="upload" :on-success="handleSuccess" action="/api/v1/files/upload" multiple :with-credentials="true" :show-file-list="false">
                                     <i class="el-icon-picture" style="font-size:18px"></i>
                                </el-upload>
                            </div>
                            <div class="textarea"  v-if="toUser">
                                <!-- <el-input type="textarea" v-model.trim="content" :rows="2" @keyup.enter.native="onSubmit"></el-input> -->
                                <div class="userTextarea" contenteditable="true" v-html="content" ref="userTextarea" @keyup.enter="onSubmit">

                                </div>
                                <el-button type="primary" @click="onSubmit" style="margin-top:10px;width:100px;">发送</el-button>
                            </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- //新建群组 -->
        <el-dialog :title="addGroupTitle" :visible.sync="dialogVisible" align="left" :close-on-click-modal="false" width="700px">
            <div style="padding-left:35px;">
                <el-form :model="rows" :rules="rules" ref="formsubmit" v-if="addGroupTitle == '新建组'">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item prop="groupName">
                                <el-input v-model="rows.groupName" placeholder="请填写组名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div  v-if="addGroupTitle != '新建组'" style="padding-left:35px;font-size:13px;color:#ae3d3d">*选择您想要新添加的群组成员</div>
            </div>
            <br />
             
            <template>
                <el-transfer filterable :titles="['人员列表', '已选列表']" :props="{key: 'username',label: 'name'}" filter-placeholder="请输入姓名" v-model="groupUsers" :data="arrGroupUsers" style="width:500px;margin:auto">
                </el-transfer>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveFormValidate()"   v-if="addGroupTitle == '新建组'" >确定</el-button>
                <el-button type="primary" @click="addGroupMembers()"  v-if="addGroupTitle != '新建组'">添加</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>
import Aside from "@/components/Aside.vue";
import TopBar from "@/components/TopBar.vue";
import axios from "@/plugins/axios";
import FilesOperate from "@/apps/FilesOperate.vue";
import { mapGetters, mapMutations } from "vuex";
import { Loading } from "element-ui";
import moment from "moment";

export default {
    name: "webim",
    data() {
        return {
            addGroupTitle:"新建组",
            groupMembers: [],
            msgList: [],
            dialogList: [],
            content: "",
            users: [],
            toUser: "",
            userList: false,
            dialogVisible: false,
            arrGroupUsers: [],
            groupUsers: [],
            createGroup_id: "",
            searchName: "",
            emoji:[],
            searchNameResult: [],
            dialogName: "",
            loginUserHasGroup: '0',
            currentUserName: "",
            currentPage: 0,
            countpage: 1,
            userIndex: -1,
            userDialogIndex: -1,
            fiterOrganUsers:[],
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
    watch: {
        msgList() {
            let $self = this;
            $self.$nextTick(() => {
                var messages = $self.$el.querySelector("#messages");
                messages.scrollTop = messages.scrollHeight;
            });
        },
        toUser(data) {
            let $self = this;
            if (data.gid) {
                JIM.getGroupMembers({
                    gid: data.gid
                })
                    .onSuccess(function(data) {
                         let  arr =  data.member_list.filter(item => $self.currentUserId == item.username);
                         if(arr[0].flag == 1){
                           $self.loginUserHasGroup = '1'; //群组
                         }else{
                           $self.loginUserHasGroup = '2'; //普通成员
                         }

                        $self.groupMembers = data.member_list;
                    })
                    .onFail(function(data) {
                        //data.code 返回码
                        //data.message 描述
                    });
            }
        }
    },
    filters: {
        //生成时间标识
        reInitTime: function(data) {
            if (
                moment(new Date()).format("YYYY-MM-DD") ==
                moment(data).format("YYYY-MM-DD")
            ) {
                return "今天 " + moment(data).format("HH:mm");
            } else if (
                moment(new Date())
                    .add(-1, "days")
                    .format("YYYY-MM-DD") == moment(data).format("YYYY-MM-DD")
            ) {
                return "昨天 " + moment(data).format("HH:mm");
            } else {
                return moment(data).format("MM-DD HH:mm");
            }
        },
       
    },

    computed: {
        ...mapGetters(["getUserConversation", "getHistoryMessage"]),
        filterGroupMember: function() {},
         transferEmoji(){
             return function (data) {
                  return this.imemoji.Emoji.emoji(data);
              } 
        }
        
    },

    methods: {
        ...mapMutations(["setUserConversation"]),

        upDataUserConversations(user){
              JIM.updateConversation({
                'extras' : {}
                });
        },  

        showAddGroup(){
            this.dialogVisible = true;
            this.addGroupTitle = "新建组";
        },

        //展开树组织结构
         addemoji(data){
            this.content =  this.$refs.userTextarea.innerHTML + data;
        },

        resetEmoji(){
            this.emoji = ['😄','😆','😉','😊','😋','😌','😍','😏','😒','😓','😔','😖','😘','😚','😜','😝','😕','😯','😞','😠','😢','😣','😥','😨','😪','😭','😰','😱','😲','😳','😷'
             ,'😇','😺','😸','😹','😼','😽','🙀','😿','😾','👏','👍','👎','✊','👈','👉','👆','👇'
            ];
        },
  

        handleSuccess(data, file, fileList) {
            let $self = this;
            if (data.length > 0) {
                 $self.sendSingleFiles(data);
            }
        },
        sendSingleFiles(data) {
            let $self = this;
            if ($self.toUser.gid) {
                JIM.sendGroupMsg({
                    target_gid: $self.toUser.gid,
                    msg_body: {
                        text: data[0].name,
                        extras: data
                    }
                })
                    .onSuccess(function(data, msg) {
                        if ($self.msgList.length == 0) {
                            $self.getHistoryMessage.push({
                                key: msg.target_gid,
                                msgs: [msg]
                            });
                            $self.msgList.push(msg);
                            $self.selectDialog($self.toUser);
                        } else {
                            $self.msgList.push(msg);
                        }
                        $self.content = "";
                    })
                    .onFail(function(data) {
                        //同发送单聊文本
                    });
            } else {
                JIM.sendSingleMsg({
                    target_username: $self.toUser.name,
                    msg_body: {
                        text: data[0].name,
                        extras: data
                    } // 可以直接从已有消息体里面获取msg_body
                })
                    .onSuccess(function(data, msg) {
                        if ($self.msgList.length == 0) {
                            data.nickName = $self.toUser.nickName;
                            $self.getUserConversation.conversations.push(data);
                            $self.getHistoryMessage.push({
                                key: data.key,
                                msgs: [msg]
                            });
                            $self.msgList.push(msg);
                            $self.toUser.key = data.key;
                            $self.selectDialog($self.toUser);
                        } else {
                            $self.msgList.push(msg);
                        }
                    })
                    .onFail(function(data) {
                        console.log("error:" + JSON.stringify(data));
                    });
            }
        },
        previewAttach(data) {
            console.log(data);
        },
        setUserShow(organ) {
            if (organ.status) {
                this.$set(organ, "status", false);
            } else {
                this.$set(organ, "status", true);
            }
        },

        //选择群组验证
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

        // 过滤人员
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

        //过滤对话框列表
        searchDialogName() {
            if (this.dialogName) {
                this.dialogList = this.getUserConversation.conversations;
                for (let item of this.dialogList) {
                    if (
                        (item.name &&
                            item.name.indexOf(this.dialogName) > -1) ||
                        (item.nickName &&
                            item.nickName.indexOf(this.dialogName) > -1)
                    ) {
                        this.$set(item, "hideCurrentDialog", false);
                    } else {
                        this.$set(item, "hideCurrentDialog", true);
                    }
                }
            } else {
                for (let item of this.dialogList) {
                    this.$set(item, "hideCurrentDialog", false);
                }
            }
        },

        //创建群组
        createGroup() {
            let $self = this;
            JIM.createGroup({
                group_name: $self.rows.groupName
                // 'is_limit':true
            })
                .onSuccess(function(data) {
                    data.name = data.group_name;
                    data.key = data.gid;
                    $self.getUserConversation.conversations.push(data);
                    $self.addGroupMembers(data.gid);
                    $self.dialogVisible = false;
                })
                .onFail(function(data) {
                    console.log("error:" + JSON.stringify(data));
                });
        },

        //添加组成员
        addGroupMembers(gid) {
            let members = [];
            let $self = this;
            for (let i = 0; i < $self.groupUsers.length; i++) {
                if (
                    $self.groupUsers[i] !=
                     $self.$store.getters.LoginData.username
                ) {
                    members.push({ username:'im_' + $self.groupUsers[i]});
                }
            }
            JIM.addGroupMembers({ gid: gid || $self.toUser.gid, member_usernames: members})
                .onSuccess(function(data) {
                    $self.dialogVisible = false;
                    $self.rows.groupName = "";
                    if(gid){
                     $self.$message({
                        message:$self.rows.groupName + '群组创建成功！',
                        type: 'success'
                     });
                    }else{
                         for(var i = 0; i<members.length; i++){
                            for(var j = 0;j<$self.arrGroupUsers.length; j++){
                                if($self.arrGroupUsers[j].username == members[i].username){
                                    $self.arrGroupUsers[j].flag = 0;
                                    $self.arrGroupUsers[j].nickName = $self.arrGroupUsers[j].nickname;
                                    $self.groupMembers.push($self.arrGroupUsers[j]);
                                }
                            };
                        };
                    }
                 
                })
                .onFail(function(data) {
                    console.log("error:" + JSON.stringify(data));
                    if(data.code == 880607){
                         $self.$message({
                        message: '成员已在群组列表里，请不要重复添加',
                        type: 'warning'
                     });
                    }
                });
        },
        
        // 新加组成员
        addNewGroupMerbers(){
            this.dialogVisible = true;
            this.addGroupTitle = this.toUser.nickName;
        },
        //删除组成员
        deleteGroupUser(user,index){
            let $self = this;
            $self.$confirm('删除后该成员将收不到群消息，要删除吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                 JIM.delGroupMembers({
                  'gid' :  $self.toUser.gid,
                 'member_usernames' : [{'username':user.username}]
               }).onSuccess(function(data) {
                   $self.groupMembers.splice(index,1);
                   $self.$message({
                    message: "群成员删除成功",
                    type: "success"
                });
               }).onFail(function(data) {
                console.log(data);
               });
            }).catch(() => {
            });
        },

        //退出群
        exitGroup(){
                let $self = this;
                if($self.toUser.gid){
                    $self.$confirm('退出后将收不到该群消息，确定要退出吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                           JIM.exitGroup({
                                'gid' : $self.toUser.gid
                            }).onSuccess(function(data) {
                             for(var i = 0; i<$self.getUserConversation.conversations.length; i++){
                                if($self.getUserConversation.conversations[i].gid && $self.getUserConversation.conversations[i].gid == $self.toUser.gid){
                                    $self.getUserConversation.conversations.splice(i,1)
                                }
                            };
                             $self.$message({
                                    message: ' 退群成功！',
                                    type: 'success'
                             });
                             $self.toUser = "";
                            }).onFail(function(data) {
                                   
                            }); 
                            
                        })
                }  
        },
        //解散群
        dissolveGroup(){
            let $self = this;
            if($self.toUser.gid){
                $self.$confirm('解散后将不能恢复，确定要解散该群组吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                        JIM.dissolveGroup({
                            'gid' : $self.toUser.gid
                        }).onSuccess(function(data) {   
                            for(var i = 0; i<$self.getUserConversation.conversations.length; i++){
                            if($self.getUserConversation.conversations[i].gid && $self.getUserConversation.conversations[i].gid == $self.toUser.gid){
                                $self.getUserConversation.conversations.splice(i,1)
                            }
                            };
                             $self.$message({
                                    message: '群组解散成功！',
                                    type: 'success'
                             });
                             $self.toUser = "";

                        }).onFail(function(data) {
                            console.log();
                        });
                    
                })
     
            }
        },

        //人员列表选人
        selectUser(user, index) {
            this.userIndex = index + user.id;
            this.loginUserHasGroup = "0";
            this.toUser = {
                name: "im_" + user.username,
                avatar: "",
                nickName: user.name
            };
            let data = this.getHistoryMessage.filter(
                item => this.toUser.name == item.from_username
            );
            if (data && data[0] && data[0].msgs) {
                this.msgList = data[0].msgs;
            } else {
                this.msgList = [];
            }
        },

        //对话列表选人
        selectDialog(user, index) {
            let $self = this;
            user.activeMark = false;
            $self.userDialogIndex = index;
            $self.toUser = user;
            $self.loginUserHasGroup = "0";
            if (user.gid) {
                user.nickName = user.name;
                JIM.resetUnreadCount({
                            'gid' : $self.toUser.gid
                 });
                 $self.toUser.unread_msg_count = 0;
            }else{
                  JIM.resetUnreadCount({
                        'username' : $self.toUser.name
                });
                 $self.toUser.unread_msg_count = 0;
            }
        
            let data = $self.getHistoryMessage.filter(
                item => $self.toUser.key == item.key
            );
            if (data && data[0] && data[0].msgs) {
                $self.msgList = data[0].msgs;
            } else {
                $self.msgList = [];
            }
        },

        //发送消息
        onSubmit() {
            let $self = this;
            $self.content = $self.$refs.userTextarea.innerHTML.replace(/<\/?div[^>]*>/gi,'');
            $self.content = $self.content.replace(/<\/?br[^>]*>/gi,'');
             console.log('isConnect:'+JIM.isConnect());
             console.log('isLogin:'+JIM.isLogin());
            console.log('isInit:'+JIM.isInit());
            if(!JIM.isLogin()){
                $self.$message({
                        message: '您的账号在其他地方登陆，可能影响即时通讯的使用',
                        type: 'warning'
                });
                return false;
            }
            if ($self.content) {
                // debugger;
                //群组消息
                if ($self.toUser.gid) {
                    JIM.sendGroupMsg({
                        target_gid: $self.toUser.gid,
                        content: $self.content
                    })
                        .onSuccess(function(data, msg) {
                            if ($self.msgList.length == 0) {
                                $self.getHistoryMessage.push({
                                    key: msg.target_gid,
                                    msgs: [msg]
                                });
                                $self.msgList.push(msg);
                                //重新绑定下 要不然新建组发来的消息收不到
                                let data = $self.getHistoryMessage.filter(
                                    item => $self.toUser.key == item.key
                                );
                                if (data && data[0] && data[0].msgs) {
                                    $self.msgList = data[0].msgs;
                                }
                            } else {
                                $self.msgList.push(msg);
                            }
                            $self.content = "";
                        })
                        .onFail(function(data) {
                            //同发送单聊文本
                        });
                } else {
                    JIM.sendSingleMsg({
                        target_username:
                            $self.toUser.name.indexOf("im") > -1
                                ? $self.toUser.name
                                : "im_" + $self.toUser.name,
                        content: $self.content,
                        target_name: $self.toUser.name
                    })
                        .onSuccess(function(data, msg) {
                            if ($self.msgList.length == 0) {
                                data.nickName = $self.toUser.nickName;
                                $self.getUserConversation.conversations.push(
                                    data
                                );
                                $self.getHistoryMessage.push({
                                    key: data.key,
                                    msgs: [msg]
                                });
                                $self.msgList.push(msg);
                                $self.toUser.key = data.key;
                                $self.selectDialog($self.toUser);
                            } else {
                                $self.msgList.push(msg);
                            }
                            $self.content = "";
                        })
                        .onFail(function(data) {
                            console.log("error:" + JSON.stringify(data));
                        });
                }
            }
        },
        //获取树桩人员列表
        getUsers() {
            axios.get("/api/v1/users").then(res => {
                this.arrGroupUsers = res.data;
            });
            ///api/v1/users/im/organs
            //api/v1/users/im/organs
            axios.get("/api/v1/users/list/organs").then(res => {
              //  res.data =  res.data.filter(item => item.name != '合肥中关村协同产业发展有限公司' &&   item.name != '石家庄中关村协同发展有限公司' && item.name != '天津京津中关村科技城发展有限公司')
                this.filterOrgansUsers(res.data);
            });
        },
        filterOrgansUsers(organs){
            let $self = this;
            organs.forEach(function(value, index) {
                if(value.users && value.users.length == 0){
                    let list = {},arr = [];
                    arr = $self.getRecursionUser(value);
                    arr = arr.reduce(function(item, next) {
                    list[next.id] ? '' : list[next.id] = true && item.push(next);
                    return item;
                }, []);
                    value.children = value.users  = arr;
                    $self.fiterOrganUsers = [];
                }
            });
            this.users = organs;
        },
        getRecursionUser(data){
            let $self = this;
            if(data.users && data.users.length == 0){
                 data.children.forEach(function(value, index) {
                        if(value.users && value.users.length == 0){
                            $self.getRecursionUser(value);
                        }else{
                            $self.fiterOrganUsers = $self.fiterOrganUsers.concat(value.users);
                        }
                 });
            };
            return $self.fiterOrganUsers;
        },

        onDrag: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },
        onDrop: function (e) {
            if(this.toUser){
                e.stopPropagation();
                e.preventDefault();
                var dt = e.dataTransfer;
                let formData = new FormData();
                for (var i = 0; i !== dt.files.length; i++) {
                    formData.append("files", dt.files[i]);
                }
                this.uploadFile(formData);
            }
        },
        uploadFile(formData){
                let $self = this;
                axios.post('/api/v1/files/upload', formData,{headers: { "Content-Type": "multipart/form-data" }}).then(res => {
                        $self.sendSingleFiles(res.data);
                })
        }
    },

    mounted() {
        let self = this;
        self.getUsers();
        this.currentUserName = this.$store.getters.LoginData.uname;
        this.currentUserId = "im_" + this.$store.getters.LoginData.username;
        var dropbox = document.querySelector('.main-messages');
        dropbox.addEventListener('dragenter', this.onDrag, false);
        dropbox.addEventListener('dragover', this.onDrag, false);
        dropbox.addEventListener('drop', this.onDrop, false);
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
                margin: 10px 5px 10px 10px;
                width: 210px;
            }
            i{
                cursor: pointer;
            }
        }
        .main-users {
            flex: 1 1 auto;
            overflow: auto;
            -webkit-box-flex: 1;
            height: 100px;
            padding-bottom:50px;
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

            .user {
                // display: flex;
                justify-content: flex-start;
                align-items: center;
                // height: 40px;

                padding: 5px 0px 5px 20px;
                border-bottom: 1px solid #f9f1f1;
                cursor: pointer;
                .avatar {
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    color: #fff;
                    font-size: 13px;
                    text-align: center;
                    line-height: 25px;
                    background: #ccc;
                    border-radius: 50%;
                    background: rgb(0, 90, 158);
                    color:#FFF;
                }
                .name {
                    margin-left: 10px;
                    font-weight: bold;
                    font-size: 13px;
                    color: #666;
                }
                .onlineavatar {
                    float: right;
                    background: #f3efef;
                    font-size: 12px;
                    margin-right: 10px;
                    width:20px;
                    height:20px;
                    border-radius: 50%;
                    border:1px solid #ccc;
                    text-align:center;
                    line-height: 20px;
                    color:#df1313;

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

            .fromeMe {
                position: relative;
                padding: 6px 35px;
                .avatar {
                    top: 10px;
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    background: rgb(204, 204, 204);
                    text-align: center;
                    line-height: 25px;
                    color: rgb(255, 255, 255);
                    font-size: 13px;
                    border-radius: 50%;
                    position: absolute;
                    right: 0px;
                }
                .wordcontent {
                    padding: 5px;
                    display: inline-block;
                    border-radius: 3px;
                    min-width: 50px;
                    span{
                        text-align: left;
                        display: inherit;
                        line-height: 1.5;
                    }
                    .attach{
                        .imgsqu{
                            border: 1px solid red;
                            line-height: 1.8;
                            min-height:150px;
                        }
                      
                    }
                    .attachments {
                        border: 1px solid red;
                        margin-right: 0px;
                    }
                    overflow:inherit;
                }
            }

            .moveLeft {
                .avatar {
                    left: 0px;
                    background: rgb(0, 90, 158);
                    color:#FFF;
                }
                .wordcontent {
                    background: #ebdbdb;
                    padding: 8px 7px;
                }
                i {
                    position: absolute;
                    right: 26px;
                    color: #ebdbdb;
                    font-size: 14px;
                    top: 8px;
                    left: 26px;
                }
            }

            .moveRight {
                 .avatar {
                    background: rgb(0, 90, 158);
                    color:#FFF;
                }
                .wordcontent {
                    background: #c7e0f4;
                    padding: 8px 7px;
                }
                text-align: right;
                i {
                    position: absolute;
                    right: 26px;
                    color: rgb(199, 224, 244);
                    font-size: 14px;
                    top: 8px;
                }
            }

            .groupAvatarLeft {
                padding: 10px 55px;
                .avatar {
                    width: 42px;
                    height: 42px;
                    line-height: 42px;
                    background: rgb(0, 90, 158);
                    color: #FFF;
                }
                i {
                    top: 13px;
                    left: 45px;
                }
            }
            .groupAvatarRight {
                padding: 10px 55px;
                .avatar {
                    width: 42px;
                    height: 42px;
                    line-height: 42px;
                    background: rgb(0, 90, 158);
                    color: #FFF;
                }
                i {
                    top: 13px;
                    right: 46px;
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
                .msgtime {
                    div {
                        -webkit-transform: scale(0.9);
                        -webkit-transform-origin: left top;
                        font-size: 11px;
                        color: #a7a4a4;
                        margin-top: 2px;
                    }
                }
                .msgtime_right {
                    div {
                        -webkit-transform-origin: right top;
                    }
                }
            }
            .textarea {
                flex: 0 0 auto;
                height: 200px;
                padding: 0 30px;
                margin-top: 5px;
                font-family: "Emoji";
                .userTextarea{
                    height:60px;
                    border: 1px solid #ece8e8;
                    padding:5px;
                    line-height: 18px;
                }
            }
            .top {
                flex: 0 0 auto;
                height: 55px;
                padding: 0 20px;
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
                    .avatar {
                        display: inline-block;
                        width: 25px;
                        height: 25px;
                        background: rgb(204, 204, 204);
                        text-align: center;
                        line-height: 25px;
                        color: rgb(255, 255, 255);
                        font-size: 13px;
                        border-radius: 50%;
                    }
                }
                .avatarActive {
                    .avatar {
                        background: rgb(0, 90, 158);
                        color: #fff;
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
