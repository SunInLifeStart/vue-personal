<template>
<el-dialog title="外部培训申请表" :visible.sync="dialogFormVisibleTrain" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">  
    <div id="TrainForm">
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
                <el-form-item label="创建时间">
                        <el-date-picker v-model="formData.createdTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%"></el-date-picker>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                     <el-form-item label="培训/学习(项目)" prop="trainingPrograms" label-width="120px">
                        <el-input v-model="formData.trainingPrograms" placeholder="请输入项目" ></el-input>
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
                <el-col :span="12">
                    <el-form-item label="日程安排">
                        <el-input v-model="formData.schedule" placeholder="请输入日程安排"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否资金计划内"  label-width="250px">
                        <span style="float:left">
                             <el-radio v-model="formData.processId" label="1">是</el-radio>
                             <el-radio v-model="formData.processId" label="2">否</el-radio>
                        </span>
                      
                    </el-form-item>
                </el-col>
            </el-row>
             
             <el-row>
                
                <el-col :span="24">
                    <el-form-item label="费用预算">
                       <span style="float:left"><el-input type="lowercase" clearable style="max-width:400px"  v-model="formData.lowercase" placeholder="小写入费用预算"></el-input></span>
                       <!-- @change="numberToChinese(formData.lowercase)" -->
                      <span  style="float:left"><el-input clearable style="max-width:400px" v-model="formData.upper" placeholder="大写入费用预算"></el-input></span>
                    </el-form-item>
                </el-col>
            </el-row>
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
import { debug, debuglog } from "util";
export default {
    name: "TrainForm",
    data() {
        return {
            dialogFormVisibleTrain: false,
            formData: this.resetForm(),
            formId: "108",
            signalUrl: "",
            users: [],
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
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "年度计划"
                    }
                ],

                committed: [
                    {
                        required: false, //是否必填
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
                consts: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入费用预算"
                    }
                ],
                processId: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入是否资金计划内"
                    }
                ],
                suggestion: [
                    {
                        required: false, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入审批意见"
                    }
                ],
                draftTime: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请选择培训时间"
                    }
                ],
                writer: [
                    {
                        required: true, //是否必填
                        trigger: "change", //何事件触发
                        message: "请选择记录人"
                    }
                ]
            }
        };
    },
    components: {
        FilesOperate
    },
    methods: {
        setDataFromParent(data) {
            this.formData = data;
            this.dialogFormVisibleTrain = true;
            this.createForm_status = false;
        },
        creatForm() {
            this.formData = this.resetForm();
            this.dialogFormVisibleTrain = this.createForm_status = true;
        },
        resetForm() {
            let formData = {
                attachments: [],
                submitter: "", //申请人
                department: "", //所属部门
                id: "",
                //  committed: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"), //提单时间
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
                processId: "",
                suggestion: "",
                consts: "",
                upper: "",
                lowercase: "",
                schedule: "",
                remarks: "",
                writer: ""
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
        saveForm(params) {
            const $self = this;
            $self.$axios
                .post("/api/v1/trainingApplication/save", $self.formData)
                .then(response => {
                    $self.msgTips("保存成功", "success");
                    if( response.data.content &&  response.data.content.id){
                         $self.formId = response.data.content.id;
                    }
                    $self.dialogFormVisibleTrain = false;
                    $self.actionsUrl = `/workflow/motor-trainingapplication_train/${
                        $self.formId
                    }/${$self.$store.getters.LoginData.uid}/actions`;

                    $self.signalUrl = `/workflow/motor-trainingapplication_train/${
                        $self.formId
                    }/${$self.$store.getters.LoginData.uid}/signal`;

                     if ($self.createForm_status) {
                        $self.$emit("reloadList", "reload"); //如果是 "新建" 表单刷新 "列表"
                    } else {
                        $self.$emit("reloadList", $self.formData); //如果是 "编辑" 表单刷新 "详情页"
                    }
                    // if (params) {
                    //     $self.startSignalForStart(); //如果是 "提交" 启动工作流
                    // } else {
                    //     $self.startSignalForSave(); //如果是 "保存"  启动保存工作流
                    // }
                })
                .catch(function() {
                    $self.msgTips("保存失败！", "warning");
                });
        },
        async startSignalForSave() {
            let actions = await this.getActions();
            let complete = await this.startSignal(actions.data.types[0]);
            await this.emitMsg();
        },
        async startSignalForStart() {
            let actions = await this.getActions();
            let complete = await this.startSignal(actions.data.types[0]);
            let actions2 = await this.getActions();
            actions2.data.types = actions2.data.types.filter(function (item) {
                        return item.action == "COMMIT";
            });
            let complete2 = await this.startSignal(actions2.data.types[0]);
            await this.emitMsg();
        },
        async getActions() {
            return await this.$axios.get(this.actionsUrl);
        },
        async startSignal(params) {
            return await this.$axios.put(this.signalUrl, params);
        },
        async emitMsg() {
            let $self = this;
            if ($self.createForm_status) {
                $self.$emit("reloadList", "reload"); //如果是 "新建" 表单刷新 "列表"
            } else {
                $self.$emit("reloadList", $self.formData); //如果是 "编辑" 表单刷新 "详情页"
            }
        },
        // getUsers() {
        //     let $self = this;
        //    this.axios.get("/api/v1/users").then(res => {
        //        $self.users = res.data;
        //     });
        // },

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
}
</style>