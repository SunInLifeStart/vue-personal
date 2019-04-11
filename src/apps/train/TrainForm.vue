<template>
<el-dialog title="外部培训申请表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="75%" style="text-align: center;">  
    <div id="TrainForm">
        <el-form :model="formData" label-width="100px" :rules="rules" ref="formupdate">
            <el-row >
                <el-col  :span="8" :offset="16" > 
                     <el-form-item label="流水号：" >
                        <span >{{formData.number}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="申请人" prop="submitter">
                        <el-input v-model="formData.submitter" placeholder="请输入申请人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属部门" prop="department" label-width="120px">
                        <el-input v-model="formData.department" placeholder="请输入所属部门"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="提单时间" prop="committed">
                        <!-- <el-input v-model="formData.committed" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="提单时间"></el-input> -->
                         <el-date-picker v-model="formData.committed" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="提单时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                 <el-col :span="12">
                    <el-form-item label="培训时间" label-width="120px"  prop="trainingTime">
                            <el-date-picker v-model="formData.trainingTime" type="daterange" @change="time_change"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
                            style="width:100%" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="是否资金计划内"  prop="type">
                        <span style="float:left">
                             <el-radio v-model="formData.type" label="true">是</el-radio>
                             <el-radio v-model="formData.type" label="false">否</el-radio>
                        </span>
                    </el-form-item>
                </el-col>
               <el-col :span="12">
                    <el-form-item label="是否纳入年度计划" prop="isAnnualPlan">
                        <span style="float:left">
                             <el-radio v-model="formData.isAnnualPlan" label="true">是</el-radio>
                             <el-radio v-model="formData.isAnnualPlan" label="false">否</el-radio>
                        </span>
                    </el-form-item>
                </el-col>
              </el-row>
            <el-row>
                <el-col :span="24">
                  <el-form-item label="培训/学习(项目)" prop="trainingPrograms">
                        <el-input type="textarea"  v-model="formData.trainingPrograms"  :autosize="{minRows: 3}"  placeholder="请输入项目" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="培训/学习(目的内容)">
                        <el-input type="textarea" :autosize="{minRows: 3}" v-model="formData.trainingContent"  placeholder="请输入目的内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="培训/学习(参加人员)">
                        <!-- <el-input v-model="formData.participant" placeholder="请输入参加人员"></el-input> -->
                         <el-input type="textarea" :autosize="{minRows: 3}" v-model="formData.participant"  placeholder="请输入参加人员"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="日程安排">
                        <el-input  type="textarea" :autosize="{minRows: 3}"  v-model="formData.schedule" placeholder="请输入日程安排"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="费用预算">
                       <span style="float:left"><el-input type="number" clearable style="width:400px"  v-model="formData.lowercase" placeholder="小写入费用预算"></el-input></span>
                       <!-- @change="numberToChinese(formData.lowercase)" -->
                      <span  style="float:left"><el-input clearable style="width:400px" v-model="formData.upper" placeholder="大写入费用预算" disabled></el-input></span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments"></FilesOperate>
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
export default {
    mixins: [publicMethods],
    name: "TrainForm",
    data() {
        return {
            dialogFormVisible: false,
            formData: this.resetForm(),
            users: [],
            appFlowName: "motor-trainingapplication_train",
            rules: {
                submitter: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入申请人"
                    }
                ],
                department: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入所属部门"
                    }
                ],
                isAnnualPlan: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "是否纳入年度计划"
                    }
                ],
                trainingTime: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "培训时间"
                    }
                ],
                committed: [
                    {
                        required: true, //是否必填
                        message: "请选择提单时间",
                        trigger: "blur"
                    }
                ],
                trainingPrograms: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入培训/学习(项目)"
                    }
                ],
                trainingContent: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入培训/学习(目的内容)"
                    }
                ],
                participant: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入培训/学习(参加人员)"
                    }
                ],
                schedule: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入日程安排"
                    }
                ],
                type: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入是否资金计划内"
                    }
                ],
               
            }
        };
    },
     watch: {
      'formData.lowercase'(val) {
          this.formData.upper = val ? this.convertCurrency(val) : "";
      }
    },
    components: {
        FilesOperate
    },
    methods: {
        floaes(){
            const self = this;
            let codes={ code: 'trainingApplication'}
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
            this.floaes()
            let formData = {
                attachments: [],
                submitter: this.$store.getters.LoginData.uname || '', //申请人
                department: this.$store.getters.LoginData.oname || '', //所属部门
                id: "",
                // committed: moment(new Date()).format("YYYY-MM-DD"), //提单时间
                committed:'',
                creatorId: this.$store.getters.LoginData.uid || '',
                creatorName:this.$store.getters.LoginData.uname || '',
                organId:this.$store.getters.LoginData.oid || '',
                organName:this.$store.getters.LoginData.oname || '',
                isAnnualPlan: "true",
                startTime: "",
                endTime: "",
                number: "",
                trainingPrograms: "",
                trainingContent: "",
                participant: "",
                type: "true",
                upper: "",
                lowercase: "",
                schedule: "",
                trainingTime: []
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
        },
        handlePreview() {},
        handleRemove() {}
    },
    mounted() {
        this.floaes()
    }
};
</script>
<style lang="scss" scoped>
#TrainForm {
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

#TrainForm  >>> .el-form-item__content{
        width: calc(100% - 112px);
    }
    #TrainForm  >>> .el-select {
        width: calc(100% - 15px);
    }
    #TrainForm  >>> .el-date-editor{
        width: calc(100% - 0px);
    }
</style>