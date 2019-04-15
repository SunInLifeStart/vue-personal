<template>
<el-dialog title="文件签发申请表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="75%" style="text-align: center;">  
    <div id="OutgoingForm">
        
        <el-form ref="formupdate" :model="formData" :rules="rules" label-width="80px" style="margin-top:10px;">
            <!-- <el-row >
                <el-col  :span="8" :offset="16" > 
                     <el-form-item label="流水号：" >
                        <span >{{formData.number}}</span>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row>
                <el-col :span="8">
                    <el-form-item label="发文字号">
                        <el-select v-model="formData.wordNo" @change="getWordyear" style="width: 100%;">
                            <el-option v-for="item in wordNoList" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="发文文号">
                        <el-input v-model="formData.docNo" style="width: 100%;"></el-input>
                        <!-- <el-input v-model="formData.docNo" style="width: 100%;" :disabled="isTemplate != true"></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="发文类型">
                        <el-select v-model="formData.type" style="width: 100%;">
                            <el-option v-for="item in type" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="紧急程度">
                        <el-select v-model="formData.urgency" style="width: 100%;">
                            <el-option v-for="item in urgency" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="行文方向" prop="direction">
                        <el-select v-model="formData.direction" style="width: 100%;">
                            <el-option v-for="item in direction" :key="item" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主送" prop="mainTo_1">
                        <el-select v-model="formData.mainTo_1" multiple filterable allow-create default-first-option placeholder="请选择主送部门" style="width:100%">
                            <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <!-- <el-cascader :options="options" :show-all-levels="false"  filterable style="width:100%" v-model="formData.mainTo_1"></el-cascader> -->
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="抄送">
                        <el-select v-model="formData.copyto_1" multiple filterable allow-create default-first-option placeholder="请选择抄送部门" style="width:100%">
                            <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <!-- <el-cascader :options="options" :show-all-levels="false" filterable style="width:100%" v-model="formData.copyto_1"></el-cascader> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="拟稿单位">
                        <el-input v-model="formData.organName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="拟稿人">
                        <el-input v-model="formData.creatorName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="核稿">
                        <el-input v-model="formData.checkorName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                
                <el-col :span="12">
                    <el-form-item label="核对">
                        <el-input v-model="formData.verify"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="印发份数">
                        <el-input v-model="formData.parts"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <!-- <el-form-item label="印制">
                        <el-select v-model="formData.printer" style="width: 100%;">
                            <el-option label="中关村发展集团办公室" value="中关村发展集团办公室"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="印制">
                        <el-input v-model="formData.printer"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="formData.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文" prop="content">
                        <FilesOperate v-if="formData.text.name" :item="formData.text" :options="{preview:true,download:true,edit:true}" @getId="getId"  @editText="editText" @getReviseData="getReviseData"></FilesOperate>
                        <el-button type="primary" size="small" @click="createTextBody" v-if="!formData.text.name">创建文件</el-button>
                        <OutgoingeditFiles @editWordData="editWordData" ref="outgoingeditfiles"></OutgoingeditFiles>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <!-- <FilesOperate :options="{uploadCommpoent:true,attachmentsList:rows.attachments}"></FilesOperate> -->
                        <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="saveFormValidate()">保存</el-button>
        <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
    </div>
</el-dialog>
  
</template>
<script>
/* eslint-disable */
import moment from "moment";
import axios from 'axios';
import FilesOperate from "../FilesOperate";
import { application } from "../application.js";
import { publicMethods } from "../application.js";
import OutgoingeditFiles from "./OutgoingeditFiles.vue";
export default {
    mixins: [publicMethods],
    name: "OutgoingForm",
    data() {
        return {
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            appFlowName: "motor-outgoingingapplication_outgoing",
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
            wordNoList: ["协同发展","协同发展党","协同发展综","协同发展人"],
            direction: ["上行文", "下行文", "平行文"],
            type: ["公司", "党委","公会"],
            urgency: ["一般", "特急"],
            dialogDisabled: false,
            toType: "",
            rules: {
                mainTo_1: [
                    { required: true, message: "请输入主送", trigger: "change" }
                ],
                title: [
                    { required: true, message: "请输入标题", trigger: "blur" }
                ],
                direction:[
                    { required: true, message: "请选择行文方向", trigger: "blur" }
                ]
                // content: [
                //     { required: true, message: '请输入正文', trigger: 'blur' }
                // ]
            },
            currentFormId: this.operationType == "create" ? "" : this.formId,
            actionsList: []
        };
    },
     watch: {
      'formData.lowercase'(val) {
          this.formData.upper = val ? this.convertCurrency(val) : "";
      }
    },
    components: {
        FilesOperate,
        OutgoingeditFiles
    },
    methods: {
          editWordData(data) {
            // console.log(data);
            if (!data.url) {
                return false;
            }
            this.formData.text = {
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
         createTextBody() {
            this.$refs.outgoingeditfiles.dialogForm = true;
            this.$refs.outgoingeditfiles.openData();
        },
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
        floaes(){
            const self = this;
            let codes={ code: 'outgoingingApplication'}
            axios.post( '/synergy-common/serialNumber/getByTableCode',codes,
                
                {
                    headers: {
                        'Content-type':
                            'application/json'
                    }
                }
            )
            .then(res => {
               this.formData.number=res.data.content.serialNumber
            })
            .catch(function () {
                self.$message({
                    message: '流水号失败',
                    type: 'error'
                });
            });
        },
        time_change(time) {
            // 改变时间获取数据
            if (time === null) {
               this.formData.startTime = "";
                this.formData.endTime = "";
            } else {
                let time0 = time[0];
                let time1 = time[1];
                this.formData.startTime = time0;
                this.formData.endTime = time1;
            }
           
        },
        setDataFromParent(data) {
            this.formData = data;
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
        },
        resetForm() {
            // this.floaes()
            let formData = {
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
                printer: decodeURI(this.$store.getters.LoginData.companyName) +'('+this.$store.getters.LoginData.oname+')',
                verify: "",
                parts: "",
                attachments: [],
                title: "",
                content: "",
                text: { name: "" },
                remark: ""
            };
            return formData;
        },
        saveFormValidate(type) {
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            let response = await $self.saveFormData(
                "/api/v1/trainingApplication/save",
                $self.formData
            );
            if (response) {
                $self.formId = response.data.content.id;
                $self.dialogFormVisible = false;
                if (params) {
                    $self.msgTips("提交成功", "success");
                    if (this.createForm_status) {
                        $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {                              
                        let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                        actions.data.types = actions.data.types.filter(
                            function(item) {
                                return item.action == "COMMIT";
                            }
                        );
                       actions.data.types[0]["comment"] =  actions.data.types[0].name;
                       await $self.startSignal(actions.data.types[0],"fromeEdit");
                       $self.emitMessage();
                    }
                } else {
                    $self.msgTips("保存成功", "success");
                    if (this.createForm_status) {
                        $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                }
            } else {
                if (params) {
                    $self.msgTips("提交失败", "warning");
                } else {
                    $self.msgTips("保存失败", "warning");
                }
            }
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.formData.attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
        }
    },
    mounted() {
        // this.floaes();
        const self = this;
        const cookieItems = document.cookie.split(";");
        cookieItems.forEach(function(item) {
            if (item.indexOf("uname") > -1) {
                self.formData.creatorName = decodeURIComponent(item.split("=")[1]);
                self.cookie_uname = decodeURIComponent(item.split("=")[1]);
            }
            if (item.indexOf("oname") > -1) {
                self.formData.organName = decodeURIComponent(item.split("=")[1]);
                self.cookie_oname = decodeURIComponent(item.split("=")[1]);
            }
            if (item.indexOf("uid") > -1 && !self.formData.checkorName) {
                axios
                    .get(
                        "/api/v1/users/" +
                            decodeURIComponent(item.split("=")[1]) +
                            "/organ/role/xtfz_deptManager"
                    )
                    .then(res => {
                        self.formData.checkorName = self.checkorName =
                            res.data.name;
                    });
            }
        });

        this.formData.printer =decodeURI(this.$store.getters.LoginData.companyName) +'('+this.$store.getters.LoginData.oname+')';
        // debugger
  }
};
</script>

<style lang="scss" scoped>
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
    input[type=number]::-webkit-inner-spin-button,  
    input[type=number]::-webkit-outer-spin-button {  
    -webkit-appearance: none;
}
}
</style>
<style scoped>

#OutgoingForm  >>> .el-form-item__content{
        width: calc(100% - 112px);
    }
    #OutgoingForm  >>> .el-select {
        width: calc(100% - 15px);
    }
    #OutgoingForm  >>> .el-date-editor{
        width: calc(100% - 0px);
    }
</style>