<template>
    <div id="OutgoingForm">
        <el-form ref="formupdate" :model="rows" :rules="rules" label-width="80px" style="margin-top:10px;">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="发文字号">
                        <el-select v-model="rows.wordNo" @change="getWordyear" style="width: 100%;">
                            <el-option v-for="item in wordNoList" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发文文号">
                        <el-input v-model="rows.docNo" style="width: 100%;"></el-input>
                        <!-- <el-input v-model="rows.docNo" style="width: 100%;" :disabled="isTemplate != true"></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="发文类型">
                        <el-select v-model="rows.type" style="width: 100%;">
                            <el-option v-for="item in type" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="紧急程度">
                        <el-select v-model="rows.urgency" style="width: 100%;">
                            <el-option v-for="item in urgency" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="行文方向">
                        <el-select v-model="rows.direction" style="width: 100%;">
                            <el-option v-for="item in direction" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主送" prop="mainTo_1">
                        <el-select v-model="rows.mainTo_1" multiple filterable allow-create default-first-option placeholder="请选择主送部门" style="width:100%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <!-- <el-cascader :options="options" :show-all-levels="false"  filterable style="width:100%" v-model="rows.mainTo_1"></el-cascader> -->
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="抄送">
                        <el-select v-model="rows.copyto_1" multiple filterable allow-create default-first-option placeholder="请选择抄送部门" style="width:100%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <!-- <el-cascader :options="options" :show-all-levels="false" filterable style="width:100%" v-model="rows.copyto_1"></el-cascader> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="拟稿单位">
                        <el-input v-model="rows.organName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿人">
                        <el-input v-model="rows.creatorName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核稿">
                        <el-input v-model="rows.checkorName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="印制">
                        <el-select v-model="rows.printer" style="width: 100%;">
                            <el-option label="中关村协同发展办公室" value="中关村协同发展办公室"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核对">
                        <el-input v-model="rows.verify"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="印发份数">
                        <el-input v-model="rows.parts"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="rows.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文" prop="content">
                        <FilesOperate v-if="rows.text.name" :item="rows.text" :options="{preview:true,download:true,edit:true}" @getId="getId"  @editText="editText" @getReviseData="getReviseData"></FilesOperate>
                        <el-button type="primary" size="small" @click="createTextBody" v-if="!rows.text.name">创建文件</el-button>
                        <OutgoingeditFiles @editWordData="editWordData" ref="outgoingeditfiles"></OutgoingeditFiles>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="备注">
                        <el-input type="textarea" :autosize="{minRows: 3}" v-model="rows.remark"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <!-- <FilesOperate :options="{uploadCommpoent:true,attachmentsList:rows.attachments}"></FilesOperate> -->
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import axios from "axios";
import FilesOperate from "../FilesOperate";
import OutgoingeditFiles from "./OutgoingeditFiles.vue";
import moment from 'moment';
export default {
    name: "OutgoingForm",
    data() {
        return {
            dialogFormVisible: false,
            percentage: 0,
            rows: {
                wordNo: "",
                docNo: "",
                creatorName: "",
                checkorName: "",
                organName: "",
                attachments: [],
                content: "",
                mainTo_1: [],
                copyto_1: [],
                text: { name: "" }
            },
            options:[],
            cookie_uname: "",
            checkorName: "",
            cookie_oname: "",
            wordNoList: [],
            direction: ["上行文", "下行文", "平行文"],
            type: ["集团发文", "集团工会发文"],
            urgency: ["一般", "特急"],
            dialogDisabled: false,
            toType: "",
            rules: {
                mainTo_1: [
                    { required: true, message: "请输入主送", trigger: "change" }
                ],
                title: [
                    { required: true, message: "请输入标题", trigger: "blur" }
                ]
                // content: [
                //     { required: true, message: '请输入正文', trigger: 'blur' }
                // ]
            },
            currentFormId: this.operationType == "create" ? "" : this.formId,
            actionsList: []
        };
    },
    components: {
        FilesOperate,
        OutgoingeditFiles
    },
    props: ["formId", "operationType"],
    mounted() {
        const self = this;
        self.getSedOrgan();
        self.getWordNo();
        if (self.operationType == "edit") {
            self.getForm();
            // this.getActions();
        }
        const cookieItems = document.cookie.split(";");
        cookieItems.forEach(function(item) {
            if (item.indexOf("uname") > -1) {
                self.rows.creatorName = decodeURIComponent(item.split("=")[1]);
                self.cookie_uname = decodeURIComponent(item.split("=")[1]);
            }
            if (item.indexOf("oname") > -1) {
                self.rows.organName = decodeURIComponent(item.split("=")[1]);
                self.cookie_oname = decodeURIComponent(item.split("=")[1]);
            }
            if (item.indexOf("uid") > -1 && !self.rows.checkorName) {
                axios
                    .get(
                        "/api/v1/users/" +
                            decodeURIComponent(item.split("=")[1]) +
                            "/organ/role/deptManager"
                    )
                    .then(res => {
                        self.rows.checkorName = self.checkorName =
                            res.data.name;
                    });
            }
        });
    },
    watch: {
        formId: function() {
            this.getForm();
            // this.getActions();
        },
        operationType: function() {
            if (this.operationType == "create") {
                this.clearForm();
            } else {
                this.getForm();
            }
        }
    },
    computed: {
        isTemplate: function() {
            let tmp = false;
            if (this.actionsList) {
                this.actionsList.forEach(function(action) {
                    if (action.type == "TEMPLATE") {
                        tmp = true;
                    }
                });
            }

            return tmp;
        }
    },
    methods: {
        getProgress(event, file, fileList) {
            this.percentage = parseInt(file.percentage);
        },
        getSedOrgan() {
            const self = this;
            axios
                .get("/api/v1/outgoing_forms/listOrg")
                .then(res => {
                    let a,b;
                    if(res.data[0].children[0].label == "集团各部（室）"){
                          b = res.data[0].children[1].children;
                          a = res.data[0].children[0];
                          self.options =  [a].concat(b);
                    }else{
                          a = res.data[0].children[0].children;
                          b = res.data[0].children[1];
                          self.options =  [b].concat(a);
                    }
                     
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        editText() {
            // this.$refs.outgoingeditfiles.dialogForm = true;
            this.$refs.outgoingeditfiles.openData(this.rows.text.url);
        },

        createTextBody() {
            // this.$refs.outgoingeditfiles.dialogForm = true;
            this.$refs.outgoingeditfiles.openData();
        },
        editWordData(data) {
            // console.log(data);
            if (!data.url) {
                return false;
            }
            this.rows.text = {
                iconUrl: data.icon_url,
                name: data.originalFilename,
                url: data.url,
                path: data.path,
                file_name: data.file_name,
                pdfUrl:
                    data.url.split("files")[0] +
                    "pdf" +
                    data.url.split("files")[1]
            };
        },
        getReviseData(repelaceData) {
            let self = this;
            self.$confirm("确定要替换吗，替换后原文件将被删除?", "提示", {
                type: "warning"
            }).then(() => {
                self.rows.attachments.forEach(function(value, index) {
                    if (value.id == repelaceData.id) {
                        axios
                            .delete(
                                "/api/v1/outgoing_forms/deleteAtt?id=" +
                                    repelaceData.id
                            )
                            .then(res => {
                                self.rows.attachments.splice(index, 1);
                                self.rows.attachments.push(repelaceData.data);
                            });
                    }
                });
            });
        },
        getId(id) {
            let self = this;
            self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                self.rows.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .delete("/api/v1/outgoing_forms/deleteAtt?id=" + id)
                            .then(res => {
                                self.rows.attachments.splice(index, 1);
                            });
                    }
                });
            });
        },
        // downloadFile(item) {
        //     this.common.preview(item);
        // },
        getWordyear() {
            const self = this;
            const date = moment().format('YYYY');
            axios
                .get(
                    "/api/v1/doc/docNo/year/" + date +"?wordNo=" +
                        encodeURI(this.rows.wordNo)
                )
                .then(res => {
                    self.rows.docNo = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        getWordNo() {
            const self = this;
            axios
                .get("/api/v1/doc/wordNo/list")
                .then(res => {
                    self.wordNoList = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        getForm(id) {
            const self = this;
            if (this.formId != "") {
                axios.get("/api/v1/outgoing_forms/" + this.formId).then(res => {
                    res.data.text =
                        res.data.text == null
                            ? { name: "" }
                            : JSON.parse(res.data.text);

                    //return false;
                    if (res.data.mainTo) {
                        res.data.mainTo_1 = res.data.mainTo.split(",");
                    } else {
                        res.data.mainTo_1 = [];
                    }
                    if (res.data.copyto) {
                        res.data.copyto_1 = res.data.copyto.split(",");
                    } else {
                        res.data.copyto_1 = [];
                    }
                    self.rows = res.data;
                });
            }
        },
        saveFormValidate(save) {
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    this.saveForm(save);
                    this.$emit("saveStatus", false);
                }
            });
        },
        saveForm(action = "") {
            const self = this;
            self.rows.text = JSON.stringify(self.rows.text);

            if (self.rows.mainTo_1.length > 0) {
                let mainTo = self.rows.mainTo_1.slice(0);
                self.rows.mainTo = mainTo.join(",");
            }

            if (self.rows.copyto_1.length > 0) {
                let copyto = self.rows.copyto_1.slice(0);
                self.rows.copyto = copyto.join(",");
            }
            self.clearTime();
            axios
                .post("/api/v1/outgoing_forms/save", self.rows)
                .then(res => {
                    self.rows.text = JSON.parse(res.data.text);
                    if (res.data.mainTo) {
                        self.rows.mainTo_1 = res.data.mainTo.split(",");
                    }

                    if (res.data.copyto) {
                        self.rows.copyto_1 = res.data.copyto.split(",");
                    }

                    self.currentFormId = res.data.id;
                    self.$emit("saveStatus", false);
                    if (action == "save") {
                        self.submitForm();
                    } else if (action == "fromEdit") {
                        self.$emit("refreshForm");
                    } else {
                        if (this.operationType == "create") {
                            this.clearForm();
                        }
                        self.$emit("refreshData");
                    }
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        clearTime() {
            this.$refs.outgoingeditfiles.clearTime();
        },
        submitCheck() {
            if (this.operationType == "create") {
                this.saveForm("save");
            } else {
                this.submitForm();
            }
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    "/api/v1/outgoings/" + this.currentFormId + "/create",
                    "",
                    {
                        headers: {
                            "Content-type": "application/json"
                        }
                    }
                )
                .then(res => {
                    if (res.data.id != "") {
                        self.commitForm(res.data.id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/outgoing_forms/${self.currentFormId}/comment`, {
                    content: "提交",
                    node:'提交',
                    action: 'COMMIT'

                })
                .then(res => {});
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    "/api/v1/outgoing_forms/" +
                        this.currentFormId +
                        "/commit/" +
                        processId,
                    "",
                    {
                        headers: {
                            "Content-type": "application/json"
                        }
                    }
                )
                .then(res => {
                    self.comment();
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
                action: "COMMIT"
            };
            axios
                .put(
                    "/api/v1/outgoings/" + this.currentFormId + "/signal",
                    JSON.stringify(params),
                    {
                        headers: {
                            "Content-type": "application/json"
                        }
                    }
                )
                .then(res => {
                    self.$emit("refreshData");
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        deleteItem(index) {
            this.$confirm("是否删除?", "提示", {
                type: "warning"
            }).then(() => {
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
        handleRemove() {},
        handlePreview() {},
        getFormData() {
            return this.rows;
        },
        openDialog(type) {
            this.toType = type;
            if (this.$refs["orgTree"]) {
                this.$refs["orgTree"].setCheckedNodes([]);
            }
            this.dialogDisabled = true;
        },
        getCheckedNodes(type) {
            const checkNodes = this.$refs["orgTree"].getCheckedNodes();
            let tmpArray = [];
            checkNodes.forEach(function(node) {
                // if (
                //     !node.children ||
                //     (node.children && node.children.length == 0)
                // ) {
                tmpArray.push(node.label);
                // }
            });
            if (this.toType == "mainTo") {
                this.rows.mainTo = tmpArray.join(",");
            } else {
                this.rows.copyto = tmpArray.join(",");
            }
        },
        deleteAttachment(id) {
            const self = this;
            if (this.rows.attachments.length > 0) {
                this.$confirm("是否删除?", "提示", { type: "warning" }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .delete(
                                "/api/v1/outgoing_forms/deleteAtt?id=" + id,
                                "",
                                {
                                    headers: {
                                        "Content-type": "application/json"
                                    }
                                }
                            )
                            .then(res => {
                                self.rows.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.rows.attachments.splice(index, 1);
                                    }
                                });
                            })
                            .catch(function() {
                                self.$message({
                                    message: "操作失败",
                                    type: "error"
                                });
                            });
                    }
                );
            }
        },
        clearForm() {
            this.rows = {
                wordNo: "",
                docNo: "",
                // secrecyTerm: '',
                type: "",
                secrecyGrade: "",
                direction: "",
                urgency: "",
                according: "",
                mainTo_1: [],
                copyto_1: [],
                organName: this.cookie_oname,
                creatorName: this.cookie_uname,
                checkorName: this.checkorName,
                printer: "",
                verify: "",
                parts: "",
                attachments: [],
                title: "",
                content: "",
                text: { name: "" },
                remark: ""
            };
            // this.mainTo = [];
            // this.copyto = [];
        }
        // getActions() {
        //     const self = this;
        //     axios
        //         .get("/api/v1/outgoings/" + this.formId + "/actions")
        //         .then(res => {
        //             self.actionsList = res.data.types;
        //         });
        // }
    }
};
</script>
<style lang="scss">
#OutgoingForm {
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 130px;
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
    .textcreate {
        font-size: 16px;
        color: #327dca;
        padding: 0px 20px;
        line-height: 20px;
    }
    .textcreate:hover {
        text-decoration: underline;
        cursor: pointer;

        i {
            display: inline-block !important;
        }
    }
}
</style>