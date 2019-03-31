<template>
<el-dialog title="用印审批表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">  
    <div id="ApprovalForm">
        <el-form :model="formData" label-width="100px" :rules="rules" ref="formupdate">
            <!-- <el-row >
                <el-col  :span="8" :offset="16" > 
                     <el-form-item label="流水号：" prop="suggestion">
                        <span >{{formData.number}}</span>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row>
                <el-col :span="12">
                    <el-form-item label="使用物品" prop="submitter">
                        <!-- <el-input v-model="formData.submitter" placeholder="请输入使用物品"></el-input> -->
                         <el-select v-model="formData.submitter" placeholder="请选择会议类型">
                            <el-option
                                v-for="item in onOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="经办人" prop="department" label-width="120px">
                        <el-input v-model="formData.department" placeholder="请输入经办人"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="领用时间"  prop="committed">
                        <!-- <el-input v-model="formData.committed" placeholder="领用时间"></el-input> -->
                        <el-date-picker v-model="formData.committed" type="date" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="结束时间" prop="trainingTime">
                            <el-date-picker v-model="formData.trainingTime" type="date" style="width:100%" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="时长" prop="timelang" label-width="120px">
                        <el-input v-model="formData.timelang" placeholder="请输入时长"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="是否外借" prop="type">
                        <span style="float:left">
                             <el-radio v-model="formData.type" label="true">是</el-radio>
                             <el-radio v-model="formData.type" label="false">否</el-radio>
                        </span>
                    </el-form-item>
                </el-col>
               <el-col :span="12">
                    <el-form-item label="陪同人" prop="isAnnualPlan">
                         <el-input v-model="formData.isAnnualPlan" placeholder="陪同人" :disabled="formData.type=='false'?true:false"></el-input>
                       
                    </el-form-item>
                </el-col>
              </el-row>
            <el-row>
                <el-col :span="24">
                  <el-form-item label="使用事由" prop="trainingPrograms" >
                        <el-input  v-model="formData.trainingPrograms"   placeholder="请输入使用事由" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="用印文件名称" prop="trainingContent">
                        <el-input  v-model="formData.trainingContent"  placeholder="请输入用印文件名称"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="用印文件" prop="participant">
                       <el-input  v-model="formData.participant"  placeholder="请输入参加人员"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="用印份数(份)" prop="schedule">
                        <el-input    v-model="formData.schedule" placeholder="请输入用印份数"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <!-- <el-row>
                <el-col :span="24">
                    <el-form-item label="费用预算">
                       <span style="float:left"><el-input type="number" clearable style="width:400px"  v-model="formData.lowercase" placeholder="小写入费用预算"></el-input></span>
                       
                      <span  style="float:left"><el-input clearable style="width:400px" v-model="formData.upper" placeholder="大写入费用预算" disabled></el-input></span>
                    </el-form-item>
                </el-col>
            </el-row> --> 
             <el-row>
                <el-col :span="24">
                    <el-form-item label="审批意见">
                        <el-input type="textarea" v-model="formData.remarks" placeholder="请输入审批意见"></el-input>
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
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
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
import FilesOperate from "../FilesOperate";
import { application } from "../application.js";
import { publicMethods } from "../application.js";
export default {
    mixins: [publicMethods],
    name: "ApprovalForm",
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
                        message: "请输入使用物品"
                    }
                ],
                timelang: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "时长"
                    }
                ],
                department: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入经办人"
                    }
                ],
                type: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "是否外借"
                    }
                ],
                isAnnualPlan: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "陪同人"
                    }
                ],

                committed: [
                    {
                        required: true, //是否必填
                        message: "请选择领用时间",
                        trigger: "blur"
                    }
                ],
                trainingTime:[
                    {
                        required: true, //是否必填
                        message: "请选择结束时间",
                        trigger: "blur"
                    }
                ],
                trainingPrograms: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入使用事由"
                    }
                ],
                trainingContent: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入用印文件名称"
                    }
                ],
                participant: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入用印文件"
                    }
                ],
                schedule: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入用印份数"
                    }
                ],
                consts: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入费用预算"
                    }
                ],
                
                suggestion: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入审批意见"
                    }
                ],
                draftTime: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请选择结束时间"
                    }
                ],
                writer: [
                    {
                        required: true, //是否必填
                        trigger: "change", //何事件触发
                        message: "请选择记录人"
                    }
                ]
            },
            onOption: [
                {
                    value: '党支部章',
                    label: '党支部章'
                },
                {
                    value: '公章',
                    label: '公章'
                },
                {
                    value: '合同章',
                    label: '合同章'
                },
                {
                    value: '工会章',
                    label: '工会章'
                },
                {
                    value: '营业执照',
                    label: '营业执照'
                },
                {
                    value: '经审委印章',
                    label: '经审委印章'
                },
            ],
        };
    },
     watch: {
      'formData.lowercase'(val) {
          this.formData.timelang = val ? this.convertCurrency(val) : "";
      }
    },
    components: {
        FilesOperate
    },
    methods: {
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
            let formData = {
                attachments: [],
                submitter: "", //使用物品
                department: this.$store.getters.LoginData.uname || '', //经办人
                timelang:'',//时长
                id: "",
                // committed: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), //领用时间
                committed: "",
                isAnnualPlan: "",
                draftUnit: "",
                draftTime: [],
                startTime: "",
                endTime: "",
                number: "",
                phone: "",
                trainingPrograms: "",
                trainingContent: "",
                participant: "",
                type: "",
                suggestion: "",
                consts: "",
                upper: "",
                lowercase: "",
                schedule: "",
                remarks: "",
                writer: "",
                trainingTime: ""
                //  created: moment(new Date()).format("YYYY-MM-DD")
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
                       await $self.startSignal(actions.data.types[0]);
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
                    $self.msgTips($self, "提交失败", "warning");
                } else {
                    $self.msgTips($self, "保存失败", "warning");
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
    mounted() {}
};
</script>
<style lang="scss" scoped>
#ApprovalForm {
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