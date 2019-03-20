<template>
<el-dialog title="外部培训申请表" :visible.sync="dialogFormVisibleTrain" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">  
    <div id="TrainForm">
        <el-form :model="rows" label-width="100px" :rules="rules" ref="formupdate">
            <el-row >
                <el-col  :span="8" :offset="16" > 
                     <el-form-item label="流水号：" prop="suggestion">
                        <span >{{rows.number}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="申请人" prop="submitter">
                        <el-input v-model="rows.submitter" placeholder="请输入申请人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属部门" prop="department" label-width="120px">
                        <el-input v-model="rows.department" placeholder="请输入所属部门"></el-input>
                    </el-form-item>
                </el-col>
               
            </el-row>
            <el-row>
                <el-col :span="12">
                <el-form-item label="创建时间">
                        <el-date-picker v-model="rows.createdTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%"></el-date-picker>
                </el-form-item>
                </el-col>
                <el-col :span="12">
                     <el-form-item label="培训/学习(项目)" prop="trainingPrograms" label-width="120px">
                        <el-input v-model="rows.trainingPrograms" placeholder="请输入项目" ></el-input>
                    </el-form-item>
                </el-col>
              </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="培训/学习(目的内容)">
                        <el-input type="textarea" :autosize="{minRows: 3}" v-model="rows.trainingContent"  placeholder="请输入目的内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="培训/学习(参加人员)">
                        <!-- <el-input v-model="rows.participant" placeholder="请输入参加人员"></el-input> -->
                         <el-input type="textarea" :autosize="{minRows: 3}" v-model="rows.participant"  placeholder="请输入参加人员"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="12">
                    <el-form-item label="日程安排">
                        <el-input v-model="rows.schedule" placeholder="请输入日程安排"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否资金计划内"  label-width="250px">
                        <span style="float:left">
                             <el-radio v-model="rows.processId" label="1">是</el-radio>
                             <el-radio v-model="rows.processId" label="2">否</el-radio>
                        </span>
                      
                    </el-form-item>
                </el-col>
            </el-row>
             
             <el-row>
                
                <el-col :span="24">
                    <el-form-item label="费用预算">
                       <span style="float:left"><el-input type="lowercase" clearable style="max-width:400px" @change="numberToChinese(rows.lowercase)" v-model="rows.lowercase" placeholder="小写入费用预算"></el-input></span>
                      <span  style="float:left"><el-input clearable style="max-width:400px" v-model="rows.upper" placeholder="大写入费用预算"></el-input></span>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="审批意见">
                        <el-input type="textarea" v-model="rows.remarks" placeholder="请输入审批意见"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left">
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
import axios from 'axios';
import moment from 'moment';
import FilesOperate from '../FilesOperate';
import { debug, debuglog } from 'util';
export default {
    name: 'TrainForm',
    data() {
        var checkPhone = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('手机号不能为空'));
            } else {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
                console.log(reg.test(value));
                if (reg.test(value)) {
                    callback();
                } else {
                    return callback(new Error('请输入正确的手机号'));
                }
            }
        };
        return {
            counter: this.initialCounter,
            dialogFormVisibleTrain:false,
            tabledata: [],
             unit: new Array("仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分"),
            rows: {
                department:'',
                departmentId:123,
                attachments: [],
                submitter: '',//申请人
                department: '',//所属部门
                committed: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),//提单时间
                isAnnualPlan:'',//培训计划
                draftUnit: '',
                // id:document.cookie.uid,
                // draftTime: moment(new Date()).format('YYYY-MM-DD'),
                draftTime:[],
                startTime:'',
                endTime:'',
                phone: '',
                number:'',
                trainingPrograms: '',
                trainingContent:'',
                participant:'',
                processId:'',
                suggestion:'',
                consts:'',
                upper:'',
                lowercase:'',
                schedule:'',
                remarks: '',
                writer: '',
                createdTime:'',
                createForm_status:true  //判断是新建还是编辑表单
                
                // delegate:[],
            },
            users: [],
            uploadId: 0,
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                submitter: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入申请人'
                    }
                ],
                department: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入所属部门'
                    }
                ],
                isAnnualPlan: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '年度计划'
                    }
                ],
             
                committed: [
                    {
                        required: false, //是否必填
                        message: '请选择提单时间',
                        trigger: 'blur'
                    }
                ],
                trainingPrograms: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入培训/学习(项目)'
                    }
                ],
                trainingContent: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入培训/学习(目的内容)'
                    }
                ],
                participant: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入培训/学习(参加人员)'
                    }
                ],
                schedule: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入日程安排'
                    }
                ],
                consts: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入费用预算'
                    }
                ],
                // upper: [
                //     {
                //         required: false, //是否必填
                //         trigger: 'blur', //何事件触发
                //         message: '请输入费用预算'
                //     }
                // ],
                processId: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入是否资金计划内'
                    }
                ],
                suggestion: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入审批意见'
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
                        trigger: 'change', //何事件触发
                        message: '请选择记录人'
                    }
                ]
            }
        };
    },
    props: ['formId','formDataFromIndex'],
    components: {
        FilesOperate
    },
    watch: {
         formDataFromIndex: {
            handler: function() {
                this.dialogFormVisibleTrain = true;
                this.rows = this.formDataFromIndex;
                this.createForm_status = false;
            },
            deep: true
        }
    },
    methods: {
    //     toDx(n) {   //阿拉伯数字转换函数
    //         switch (n) {
    //         case "0":
    //             return "零";
    //         case "1":
    //             return "壹";
    //         case "2":
    //             return "贰";
    //         case "3":
    //             return "叁";
    //         case "4":
    //             return "肆";
    //         case "5":
    //             return "伍";
    //         case "6":
    //             return "陆";
    //         case "7":
    //             return "柒";
    //         case "8":
    //             return "捌";
    //         case "9":
    //             return "玖";
    //         }
    //   },
    //   // 转换算法主函数
    //   numberToChinese(m){
    //     let self = this;
    //     // debugger
    //     m *= 100;
    //     m += "";
    //     var length = m.length;
 
    //     var result = "";
    //     for (var i = 0; i < length; i++) {
    //       if (i == 2) {
    //         result = "元" + result;
    //       } else if (i == 6) {
    //         result = "万" + result;
    //       }
    //       if (m.charAt(length - i - 1) == 0) {
    //         if (i != 0 && i != 1) {
    //           if (result.charAt(0) != '零' && result.charAt(0) != '元' && result.charAt(0) != '万') {
    //             result = "零" + result;
    //           }
    //         }
    //         continue;
    //       }
    //       result = this.toDx(m.charAt(length - i - 1)) + this.unit[this.unit.length - i - 1] + result;
    //     }
    //     result += result.charAt(result.length - 1) == '元' ? "整" : "";
    //     this.rows.upper=result;
    
    //   },
    //   time_change() {
    //     // 改变时间获取数据
    //    if (this.rows.draftTime == null) {
    //       this.rows.draftTime = []
    //       this.rows.startTime = ''
    //       this.rows.endTime = ''
    //     }
    //     else {
    //       this.rows.startTime = this.rows.draftTime[0]
    //       this.rows.endTime = this.rows.draftTime[1]
    //     }
    //   },
        clearForm() {
            this.rows = {
                attachments: [],
                submitter: '',//申请人
                department: '',//所属部门
                id:'',
                committed: this.rows.committed,//提单时间
                isAnnualPlan:'',
                draftUnit: this.rows.draftUnit,
                // draftTime: moment(new Date()).format('YYYY-MM-DD'),
                draftTime:[],
                startTime:'',
                endTime:'',
                number:'',
                phone: '',
                trainingPrograms: '',
                trainingContent:'',
                participant:'',
                processId:'',
                suggestion:'',
                consts:'',
                upper:'',
                lowercase:'',
                schedule:'',
                remarks: '',
                // delegate:[],
                writer: ''
            };
        },
        // getForm() {
        //     const self = this;
        //     if (this.formId != '') {
        //         // axios
        //         //     .get('/trainingApplication/save/' + this.formId)
        //         //     .then(res => {
        //         //         //res.data.delegate = res.data.delegate.split(",");
        //         //         self.rows = res.data;
        //         //     })
        //         //     .catch(function() {
        //         //         self.$message({
        //         //             message: '操作失败',
        //         //             type: 'error'
        //         //         });
        //         //     });
        //     }
        // },
        saveFormValidate(type) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        // 提交保存
        saveForm(params) {
            const $self = this;
            axios
                .post(
                   '/trainingApplication/save', $self.rows
                )
                .then(response => {
                    $self.dialogFormVisibleTrain = false;
                    $self.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                    if($self.createForm_status){ //如果是新建表单刷新列表
                        $self.$emit("reloadList","reload");
                    }else{ //如果是编辑表单刷新详情页
                        $self.$emit("reloadList",$self.rows); 
                    }

                    if(params){//如果是提交启动工作流
                       $self.startSignal();
                    }

                })
                .catch(function() {
                    $self.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                });
           
        },
        startSignal() {
                 this.$message({
                        message: '启动工作流！',
                        type: 'success'
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
        downloadFile(url) {
            window.open(url, '_blank');
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