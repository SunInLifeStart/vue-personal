<template>
    <div id="GmoMeetingForm">
        <el-form :model="rows" label-width="100px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="文件内容">
                        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="rows.content">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="议题">
                        <el-collapse v-show="rows.meetingTasks.length > 0" v-model="activeNames" accordion>
                            <el-collapse-item v-for="(item,index) in rows.meetingTasks" :key="index">
                                <template slot="title">
                                    <div style="color:#005a9e">
                                        <div class="ytTitle">
                                            <el-tag size="mini">{{index+1}}</el-tag> &nbsp; {{item.title}}
                                        </div>
                                        <span class="editicon">
                                            <i class="icon iconfont el-icon-edit-outline" @click="editDiscussion(item,index,$event)" style="margin-right:15px;font-size:20px"></i>
                                            <i class="icon iconfont el-icon-delete" @click="deleteDiscussion(item,$event,index)" style="color:red;font-size:20px"></i>
                                        </span>
                                    </div>
                                </template>
                                <div style="padding-left:30px;">{{item.content}}</div>
                            </el-collapse-item>
                        </el-collapse>
                        <el-row>
                            <i class="icon iconfont el-icon-circle-plus" style="font-size:20px;cursor:pointer" @click="addDiscussion"></i>
                        </el-row>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-col :span="24">
                            <el-form-item label="出席">
                                <!-- <el-select style="width:100%;" v-model="rows.Attend"  filterable  readonly  allow-create default-first-option placeholder="请选择出席人员">
                                    <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                                    </el-option>
                                </el-select> -->
                                <el-input type="textarea" :rows="1" placeholder="出席人" disabled v-model="rows.attend"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="24">
                        <el-form-item label="记录">
                              <el-input type="text" placeholder="请输入记录人" v-model="rows.writer">
                        </el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item)">
                            <img class="el-icon-document" :src="item.iconUrl">
                            <p :title="item.name">{{item.name}}</p>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog title="新增议题" :visible.sync="dialogFormDiscussion" width="960px" top="150px" custom-class="discussion" append-to-body>
            <DiscussionForm ref="DiscussionForm" :users="users" @currentDiscussionData="getDiscussionData"></DiscussionForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="savaDiscussion">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import axios from "axios";
// import { mapGetters } from "vuex";
import moment from "moment";
import DiscussionForm from "./DiscussionForm";
export default {
    name: "GmoMeetingForm",
    data() {
        return {
            tabledata: [],
            rows: {
                content: "",
                attend: "",
                writer: "",
                meetingTasks: [],
                attachments: []
            },
            activeNames: [1, 2],
            users: [],
            currentEdit: true,
            dialogFormDiscussion: false,
            loginData: {
                organId: "", // 部门id,
                organName: "", //"部门名称",
                creatorId: "", //创建id,
                creatorName: "" //"创建人姓名",
            },
            currentFormId: this.operationType == "create" ? "" : this.formId
        };
    },
    components: {
        DiscussionForm
    },
    props: ["formId", "operationType"],
    watch: {
        formId: function() {
            if (this.operationType == "edit") {
                this.getForm();
            } else {
                this.rows = {
                    content: "",
                    attend: "",
                    writer: "",
                    meetingTasks: [],
                    attachments: []
                };
            }
        },
        operationType: function() {
            if (this.operationType == "create") {
                this.rows = {
                    content: "",
                    attend: "",
                    writer: "",
                    meetingTasks: [],
                    attachments: []
                };
            } else if (this.operationType == "edit") {
                this.getForm();
            }
        }
    },

    // computed: {
    //     ...mapGetters(["getLoginData"])
    // },
    mounted() {
        const self = this;
        const cookieItems = document.cookie.split(";");
        for (let item of cookieItems) {
            if (item.indexOf("uname") > -1) {
                self.loginData.creatorName = decodeURIComponent(
                    item.split("=")[1]
                );
            }
            if (item.indexOf("oname") > -1) {
                self.loginData.organName = decodeURIComponent(
                    item.split("=")[1]
                );
            }
            if (item.indexOf("uid") > -1) {
                self.loginData.creatorId = decodeURIComponent(
                    item.split("=")[1]
                );
            }
            if (item.indexOf("oid") > -1) {
                self.loginData.organId = decodeURIComponent(item.split("=")[1]);
            }
        }
        this.getUsers();
    },
    methods: {
        getUsers() {
            axios.get("/api/v1/users", "").then(res => {
                this.users = res.data;
            });
        },
        getForm() {
            const self = this;
            if (this.formId != "") {
                axios
                    .get("/api/v1/gmo_meeting_forms/" + this.formId)
                    .then(res => {
                        self.rows = {
                            content:res.data.content,
                            attend: res.data.attend,
                            writer: res.data.writer,
                            meetingTasks: res.data.meetingTasks,
                            attachments:  res.data.attachments,
                        };
                    })
                    .catch(function() {
                        self.$message({
                            message: "操作失败",
                            type: "error"
                        });
                    });
            }
        },
        addDiscussion() {
            this.currentEdit = false;
            this.dialogFormDiscussion = true;
        },
        editDiscussion(item, index, event) {
            this.currentEditIndex = index;
            event.stopPropagation();
            const self = this;
            self.currentEdit = true;
            self.dialogFormDiscussion = true;
            self.$refs.DiscussionForm.userId = [];
            self.$refs.DiscussionForm.formData = JSON.parse(
                JSON.stringify(item)
            );
            for (let a of item.delegates) {
                self.$refs.DiscussionForm.userId.push(a.id);
            }
        },
        savaDiscussion() {
            this.$refs.DiscussionForm.savaCurrentDiscussion();
        },
        deleteDiscussion(item, event, index) {
            event.stopPropagation();
            this.$confirm("是否删除此?", "提示", {
                type: "warning"
            }).then(() => {
                this.rows.meetingTasks.splice(index, 1);
            });
        },
        getDiscussionData(data) {
            this.dialogFormDiscussion = false;
            const arr = [];
            if (this.currentEdit == false) {
                this.rows.meetingTasks.push(data); //新增议题
            } else {
                this.rows.meetingTasks[this.currentEditIndex] = data; //编辑议题
            }
            for (let a of this.rows.meetingTasks) {
                for (let c of a.delegates) {
                    arr.push(c.name);
                    this.rows.attend = Array.from(new Set(arr)).join(",");
                }
            }
        },

        saveForm(action = "") {
            const self = this;
            self.rows = Object.assign(self.rows, self.loginData);
            axios
                .post("/api/v1/gmo_meeting_forms/save", self.rows)
                .then(res => {
                    self.currentFormId = res.data.id;
                    self.$emit("refreshData");
                    if (action == "savecreate") {
                        self.submitForm();
                    } else {
                        self.rows.attend = "";
                        self.rows.writer = "";
                        self.rows.meetingTasks = [];
                        self.rows.content = "";
                    }
                })
                .catch(function() {
                    self.rows.attend = "";
                    self.rows.writer = "";
                    self.rows.meetingTasks = [];
                    self.rows.content = "";
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        submitCheck() {
            if (this.operationType == "create") {
                this.saveForm("savecreate");
            } else {
                this.submitForm();
                // this.startProcess();
            }
        },
        submitForm() {
            const self = this;
            // self.rows = Object.assign(self.rows, self.loginData);
            axios
                .post("/api/v1/gmo_meetings/" + self.currentFormId + "/create")
                .then(res => {
                    if (res.data.id != "") {
                        self.commitForm(res.data.id);
                    }
                    self.currentFormId = res.data.id;
                    self.rows.attend = "";
                    self.rows.writer = "";
                    self.rows.meetingTasks = [];
                    self.rows.content = "";
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    "/api/v1/gmo_meeting_forms/" +
                        this.currentFormId +
                        "/commit/" +
                        processId,
                    ""
                )
                .then(res => {
                    self.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        startProcess() {
            const self = this;
            const params = {
                action: "COMMENT"
            };
            axios
                .put(
                    "/api/v1/gmo_meeting_forms/" +
                        this.currentFormId +
                        "/signal",
                    params
                )
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        deleteItem(index) {
            this.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                this.tableData.splice(index, 1);
            });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        downloadFile(file) {
            this.common.preview(file);
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {},
        getFormData() {
            return this.rows;
        }
    }
};
</script>
<style lang="scss" scoped>
#GmoMeetingForm {
    .uploadBtn {
        // background: red;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;
        border-radius: 2px;
        cursor: pointer;
        .el-upload {
            width: 100%;
            height: 100%;
            i {
                font-size: 50px;
                margin-top: 35px;
            }
        }
    }
    .el-collapse {
        margin-bottom: 10px;
    }
    .ytTitle {
        display: inline-block;
        width: 850px;
        height: 37px;
        overflow: hidden;
        word-break: keep-all;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .el-icon-jiahao {
        font-size: 24px;
    }
    .editicon {
        float: right;
        margin-right: 20px;
    }
    .attachments {
        margin-left: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;
        border-radius: 2px;
        cursor: pointer;
        img {
            width: 100px;
            height: 120px;
        }

        p {
            margin: 0;
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>