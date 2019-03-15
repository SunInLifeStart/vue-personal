<template>
    <div id="TrainForm">
        <el-form :model="rows" label-width="100px" :rules="rules" ref="formupdate">
            <el-row style="float:left;margin-botton:20px">
                <el-col :span="24" > 
                     <el-form-item label="流水号：" prop="suggestion">
                        <span style="font-weight:normal">{{rows.serialNumber}}</span>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="申请人" prop="numbers">
                        <el-input v-model="rows.numbers" placeholder="请输入申请人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属部门" prop="filetitle">
                        <el-input v-model="rows.filetitle" placeholder="请输入所属部门"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="提单时间">
                        <!-- :disabled="true" -->
                        <el-input v-model="rows.drafter" placeholder="请输入提单时间" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                 <el-col :span="8">
                    <el-form-item label="培训时间">
                        <el-date-picker v-model="rows.draftTime" style="width:100%" type="date">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="是否纳入年度培训计划" style="width:400px;margin-left:30px" >
                        <!-- <el-input v-model="rows.draftUnit" placeholder="请输入是否纳入年度培训计划" ></el-input> -->
                        <el-radio v-model="rows.trainingPlan" label="1">是</el-radio>
                        <el-radio v-model="rows.trainingPlan" label="2">否</el-radio>
                    </el-form-item>
                </el-col>
              </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="培训/学习(项目)" prop="content">
                    <!-- type="textarea" :autosize="{ minRows: 2, maxRows: 20}" :rows="3" -->
                        <el-input v-model="rows.content" placeholder="请输入项目" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="培训/学习(目的内容)">
                        <el-input v-model="rows.contentLine" placeholder="请输入目的内容"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="培训/学习(参加人员)">
                        <el-input v-model="rows.contentPeople" placeholder="请输入参加人员"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="日程安排">
                        <el-input v-model="rows.schedule" placeholder="请输入日程安排"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
             
             <el-row>
                <el-col :span="24">
                    <el-col :span="2"><div class="grid-content bg-purple">
                        <el-form-item label="费用预算"></el-form-item> </div>
                    </el-col>
                    <el-col :span="14">
                        <div style="">
                            小写：<el-input style="max-width:400px" @change="numberToChinese(rows.consts)" v-model="rows.consts" placeholder="小写入费用预算"></el-input>
                            <!-- 大写：<el-input style="max-width:400px" v-model="rows.consts" placeholder="大写入费用预算"></el-input> -->
                      </div>
                    </el-col>
                    
                </el-col>
                 <el-col :span="24">
                    <el-col :span="2"><div class="grid-content bg-purple">
                        <el-form-item label=""></el-form-item> </div>
                    </el-col>
                    <el-col :span="14">
                        <div style="">
                            <!-- 小写：<el-input style="max-width:400px" v-model="rows.consts" placeholder="小写入费用预算"></el-input> -->
                            大写：<el-input style="max-width:400px" v-model="rows.constsTwo" placeholder="大写入费用预算"></el-input>
                      </div>
                    </el-col>
                    
                </el-col>
            </el-row>
             <el-row style="margin-top:20px">
                <el-col :span="24">
                    <el-form-item label="是否资金计划内" style="float:left">
                        <!-- <el-input v-model="rows.remarks" placeholder="备注"></el-input> -->
                        <el-radio v-model="rows.draftline" label="1">是</el-radio>
                        <el-radio v-model="rows.draftline" label="2">否</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>
             <el-row>
                <el-col :span="24">
                    <el-form-item label="审批意见">
                        <el-input type="textarea" v-model="rows.suggestion" placeholder="请输入审批意见"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row>
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
            </el-row> -->
        </el-form>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import FilesOperate from '../FilesOperate';
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
            tabledata: [],
             unit: new Array("仟", "佰", "拾", "", "仟", "佰", "拾", "", "角", "分"),
            rows: {
                attachments: [],
                numbers: '',//申请人
                filetitle: '',//所属部门
                drafter: '',//提单时间
                trainingPlan:'',//培训计划
                draftUnit: '',
                draftTime: moment(new Date()).format('YYYY-MM-DD'),
                phone: '',
                serialNumber:'123',
                content: '',
                contentLine:'',
                contentPeople:'',
                draftline:'',
                suggestion:'',
                consts:'',
                constsTwo:'',
                schedule:'',
                remarks: '',
                writer: ''
                // delegate:[],
            },
            users: [],
            uploadId: 0,
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                numbers: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入申请人'
                    }
                ],
                filetitle: [
                    {
                        required: true, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入所属部门'
                    }
                ],
                trainingPlan: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '年度计划'
                    }
                ],
             
                drafter: [
                    {
                        required: false, //是否必填
                        message: '请选择提单时间',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入培训/学习(项目)'
                    }
                ],
                contentLine: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入培训/学习(目的内容)'
                    }
                ],
                contentPeople: [
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
                constsTwo: [
                    {
                        required: false, //是否必填
                        trigger: 'blur', //何事件触发
                        message: '请输入费用预算'
                    }
                ],
                draftline: [
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
    props: ['formId', 'operationType'],
    components: {
        FilesOperate
    },
    watch: {
        formId: function() {
            if (this.operationType == 'edit') {
                this.getForm();
            } else {
                clearForm();
            }
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
            } else if (this.operationType == 'edit') {
                this.getForm();
            }
        }
    },
    mounted() {
        const cookieItems = document.cookie.split(';');
        for (let item of cookieItems) {
            if (item.indexOf('uname') > -1) {
                // 提单时间
                // this.rows.drafter = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > -1) {
                this.rows.draftUnit = decodeURIComponent(item.split('=')[1]);
            }
        }
        if (this.operationType == 'edit') {
            this.getForm();
        } else if (this.operationType == 'create') {
        }
        this.getUserList();
    },
    methods: {
        toDx(n) {   //阿拉伯数字转换函数
            switch (n) {
            case "0":
                return "零";
            case "1":
                return "壹";
            case "2":
                return "贰";
            case "3":
                return "叁";
            case "4":
                return "肆";
            case "5":
                return "伍";
            case "6":
                return "陆";
            case "7":
                return "柒";
            case "8":
                return "捌";
            case "9":
                return "玖";
            }
      },
      // 转换算法主函数
      numberToChinese(m){
        let self = this;
        // debugger
        m *= 100;
        m += "";
        var length = m.length;
 
        var result = "";
        for (var i = 0; i < length; i++) {
          if (i == 2) {
            result = "元" + result;
          } else if (i == 6) {
            result = "万" + result;
          }
          if (m.charAt(length - i - 1) == 0) {
            if (i != 0 && i != 1) {
              if (result.charAt(0) != '零' && result.charAt(0) != '元' && result.charAt(0) != '万') {
                result = "零" + result;
              }
            }
            continue;
          }
          result = this.toDx(m.charAt(length - i - 1)) + this.unit[this.unit.length - i - 1] + result;
        }
        result += result.charAt(result.length - 1) == '元' ? "整" : "";
        this.rows.constsTwo=result;
    
     },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.rows.attachments.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get('/api/v1/board_meeting_forms/deleteAtt/' + id)
                            .then(res => {
                                self.rows.attachments.splice(index, 1);
                            });
                        self.rows.attachments.splice(index, 1);
                    }
                });
            });
        },
        getUserList() {
            axios.get('/api/v1/users', '').then(res => {
                this.users = res.data;
            });
        },
        clearForm() {
            this.rows = {
                attachments: [],
                numbers: '',//申请人
                filetitle: '',//所属部门
                // drafter: this.rows.drafter,//提单时间
                 drafter:'',
                trainingPlan:'',
                draftUnit: this.rows.draftUnit,
                draftTime: moment(new Date()).format('YYYY-MM-DD'),
                serialNumber:'',
                phone: '',
                content: '',
                contentLine:'',
                contentPeople:'',
                draftline:'',
                suggestion:'',
                consts:'',
                constsTwo:'',
                schedule:'',
                remarks: '',
                // delegate:[],
                writer: ''
            };
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/board_meeting_forms/' + this.formId)
                    .then(res => {
                        //res.data.delegate = res.data.delegate.split(",");
                        self.rows = res.data;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        saveFormValidate(type) {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                    this.$emit('saveStatus', false);
                }
            });
        },
        saveForm(action = '') {
            const self = this;
            //  if (self.rows.delegate.length > 0) {
            //     self.rows.delegate = self.rows.delegate.join(",");
            // } else {
            //     self.rows.delegate = "";
            // }
            axios
                .post(
                    '/api/v1/board_meeting_forms/save',
                    JSON.stringify(self.rows),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    if (self.operationType == 'create') {
                        self.clearForm();
                    }
                    if (action == 'submit') {
                        self.submitForm();
                    } else {
                        self.$emit('refreshData');
                        if (this.operationType == 'edit') {
                            self.$emit('refreshDetail');
                        }
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        submitCheck() {},
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/board_meetings/' + this.currentFormId + '/create',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    if (res.data.id != '') {
                        self.commitForm(res.data.id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/board_meeting_forms/' +
                        this.currentFormId +
                        '/commit/' +
                        processId,
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.comment();
                    this.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        comment() {
            let self = this;
            axios
                .put(
                    `/api/v1/board_meeting_forms/${self.currentFormId}/comment`,
                    {
                        content: '提交',
                        action: 'COMMIT',
                        node: '提交'
                    }
                )
                .then(res => {});
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT'
            };
            axios
                .put(
                    '/api/v1/board_meetings/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                    if (this.operationType == 'edit') {
                        self.$emit('refreshDetail');
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteAttachment(id) {
            const self = this;
            if (this.rows.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/board_meeting_forms/deleteAtt/' + id,
                                {
                                    headers: {
                                        'Content-type': 'application/json'
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
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
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