<template>
<el-dialog title="文件签发申请表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="75%" style="text-align: center;">  
    <div id="OutgoingForm">
        <el-form ref="formupdate" :model="formData" :rules="rules" label-width="80px" style="margin-top:10px;">
            <el-row v-if="isFromDetailsEdits">
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
            <div v-if="!isFromDetailsEdits">
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
                                <el-option v-for="item in optionsone" :key="item.id" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="抄送">
                            <el-select v-model="formData.copyto_1" multiple filterable allow-create default-first-option placeholder="请选择抄送部门" style="width:100%">
                                <el-option v-for="item in optionsone" :key="item.id" :label="item.label" :value="item.value"></el-option>
                            </el-select>
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
                        <el-form-item label="正文" style="float:left">
                            <FilesOperate v-if="formData.text.name" :item="formData.text" :options="{preview:true,download:true,edit:true}"  @editText="openData(formData.text.url)"></FilesOperate>
                            <el-button type="primary" size="small" @click="createTextBody" v-if="!formData.text.name">创建文件</el-button>
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
                            <div v-for="(item,index) in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments(index,formData.attachments,'/api/v1/outgoing_forms/deleteAtt?id='+ item.id,'delete')"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
    </div>
    <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogSelectCode"
                width="30%"  append-to-body
                center>
                  <el-select v-model="branchCode" placeholder="请选择" style="width:100%">
                    <el-option
                    v-for="item in currentRoles"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                    </el-option>
                </el-select>
                <span slot="footer" class="dialog-footer">
                   <el-button type="default" @click="saveFormValidate()">保存</el-button>
                   <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
                </span>
        </el-dialog>
    <div slot="footer" class="dialog-footer">
        <!-- v-if="this.status == '' || this.status == '已驳回' " -->
        <el-button type="default" @click="saveFormValidate()" >保存</el-button>
        <el-button type="primary" @click="saveFormValidate(true)" v-if="!isFromDetailsEdit && !isFromDetailsEdits">提交</el-button>
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
export default {
    mixins: [publicMethods],
    name: "OutgoingForm",
    data() {
        return {
            dialogTitle:"",
            dialogSelectCode:false,
            currentRoles:[],
            branchCode:"",
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            appFlowName: "outgoing-form_outgoing",
            percentage: 0,
            isFromDetailsEdit:false,
            isFromDetailsEdits:false,
            formData: {
                wordNo: "",
                docNo: "",
                creatorName: "",
                checkorName: "",
                organName: "",
                attachments: [],
                content: "",
                mainTo_1:[],
                copyto_1: [],
                text: { name: "" }
            },
            optionsone:[
                {
                    value: '中关村协同发展投资有限公司',
                    label: '中关村协同发展投资有限公司'
                },
                {
                    value: '天津京津中关村科技城发展有限公司',
                    label: '天津京津中关村科技城发展有限公司'
                },
                {
                    value: '石家庄中关村协同发展有限公司',
                    label: '石家庄中关村协同发展有限公司'
                },
                {
                    value: '合肥中关村协同产业发展有限公司',
                    label: '合肥中关村协同产业发展有限公司'
                },
                {
                    value: '天津京津中关村孵化器有限公司',
                    label: '天津京津中关村孵化器有限公司'
                },
                {
                    value: '天津中科城乐居房地产开发有限公司',
                    label: '天津中科城乐居房地产开发有限公司'
                }
            ],
            options:[],
            cookie_uname: "",
            checkorName: "",
            cookie_oname: "",
            wordNoList:[],
            // wordNoList: ["协同发展","协同发展党","协同发展综","协同发展人","天津科技城"],
            direction: ["上行文", "下行文", "平行文"],
            type: ["公司", "党委","工会"],
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
        formId: function() {
            // this.getForm();
            // this.getActions();
        },
        operationType: function() {
            if (this.operationType == "create") {
                this.clearForm();
            } else {
                // this.getForm();
            }
        }
    },
    components: {
        FilesOperate,
    },
    methods: {
        getwordNoList() {
            const self = this;
            let onames={ "oname": decodeURI(this.$store.getters.LoginData.companyName)}
            axios
                .post("api/v1/doc/wordNo/getByOid",onames,
                {
                    headers: {
                        'Content-type':
                            'application/json'
                    }
                })
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
        
         getSedOrgan() {
            const self = this;
            axios
                .get("/api/v1/users/sub/organ/list")
                .then(res => {
                    for(let item of res.data){
                        item.label = item.value = item.name;
                    }
                    // res.data.unshift({value:"集团各部（室）",id:"01",label:"集团各部（室）"});
                    self.options = res.data; 
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        createTextBody() {
            this.openData();
        },
         getWordyear() {
            const self = this;
            const date = moment().format('YYYY');
            axios
                .get(
                    "/api/v1/doc/docNo/year/" + date +"?wordNo=" +
                        encodeURI(this.formData.wordNo)
                )
                .then(res => {
                    self.formData.docNo = res.data;
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
        setDataFromParent(data,status) {
            this.getwordNoList()
            if(typeof data.text == "string"){
                if(data.text && JSON.parse(data.text).name){
                    data.text = JSON.parse(data.text);
                 }
            }
            this.formData = data;
            if(data.mainTo!="" && data.mainTo!==null){
               this.formData.mainTo_1 = data.mainTo.split(",");
            }
            if(data.copyto!="" && data.copyto!==null){
             this.formData.copyto_1 = data.copyto.split(",");
            }
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
            this.isFromDetailsEdit = status;
        },
        setDataFromParents(data,status) {
           if(typeof data.text == "string"){
                if(data.text && JSON.parse(data.text).name){
                    data.text = JSON.parse(data.text);
                 }
            }
            this.formData = data;
            if(data.mainTo!="" && data.mainTo!==null){
               this.formData.mainTo_1 = data.mainTo.split(",");
            }
            if(data.copyto!="" && data.copyto!==null){
             this.formData.copyto_1 = data.copyto.split(",");
            }
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
            this.isFromDetailsEdits = status;
        },
        createForm() {
           this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = "";
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
                 generalManagement: false,
                 branchlineTo:'1',
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
             if($self.createForm_status){
                if(await $self.juderCode() == "returnDialog"){
                    return false;
                }
            }
            $self.formData.text = JSON.stringify($self.formData.text);
            if ($self.formData.mainTo_1.length > 0) {
                let mainTo = $self.formData.mainTo_1.slice(0);
                $self.formData.mainTo = mainTo.join(",");
            }

            if ($self.formData.copyto_1 && $self.formData.copyto_1.length > 0) {
                let copyto = $self.formData.copyto_1.slice(0);
                $self.formData.copyto = copyto.join(",");
            }
            if ($self.formData.organName === '综合管理部') {
                    $self.formData.generalManagement = true
                    // $self.formData.branchlineTo
                }
            let response = await $self.saveFormData(
                "/api/v1/outgoing_forms/save",
                $self.formData
            );
            if (response) {
                $self.formData.text = JSON.parse(response.data.text);
                    if (response.data.mainTo) {
                        $self.formData.mainTo_1 = response.data.mainTo.split(",");
                    }

                    if (response.data.copyto) {
                        $self.formData.copyto_1 = response.data.copyto.split(",");
                    }
                $self.formId = response.data.id;
                // $self.dialogFormVisible = false;
                 $self.dialogFormVisible = $self.dialogSelectCode =  false;
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
                    this.$emit('getFormDetails', $self.formId)
                    if (this.createForm_status) {
                        $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                }
            } else {
                if (params) {
                     if(!this.dialogSelectCode){
                           $self.msgTips("提交失败", "warning");
                   }
                } else {
                   if(!this.dialogSelectCode){
                          $self.msgTips("保存失败", "warning");
                   }
                   
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
        clearForm() {
            this.formData = {
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
                printer: this.$store.getters.LoginData.oname,
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
        },
        submitUpload() {
            this.$refs.upload.submit();
        }
    },
    mounted() {
         const self = this;
        // this.floaes();
        this.getwordNoList()
       //  self.getForm();
         self.getSedOrgan();
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
                let type  = self.$store.getters.LoginData.code.split("_")[0];
                axios
                    .get(
                        "/api/v1/users/" +
                            decodeURIComponent(item.split("=")[1]) +
                            "/organ/role/"+type+"_deptManager"
                    )
                    .then(res => {
                        self.formData.checkorName = self.checkorName =
                            res.data.name;
                    });
            }
        });

        this.formData.printer =decodeURI(this.$store.getters.LoginData.companyName) +'('+this.$store.getters.LoginData.oname+')';
       
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