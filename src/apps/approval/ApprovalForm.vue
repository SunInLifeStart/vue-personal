<template>
<el-dialog title="用印审批表" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="85%" style="text-align: center;">  
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
                 <el-col :span="8">
                    <el-form-item label="申请人" prop="creatorName" >
                        <el-input v-model="formData.creatorName" :disabled="true" placeholder="请输入申请人"></el-input>
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="申请时间" prop="created">
                        <el-input  v-model="formData.created" :disabled="true" placeholder="请输入申请时间"></el-input>
                       
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请部门" prop="organName" >
                        <el-input v-model="formData.organName" :disabled="true" placeholder="请输入申请部门"></el-input>
                    </el-form-item>
                </el-col>
           </el-row>
             <el-row>
                <el-col :span="8">
                    <el-form-item label="领用时间"  prop="recipientsTime">
                         <el-date-picker v-model="formData.recipientsTime"  @change="getHour(formData.recipientsTime,formData.endTime)"
                         value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="领用时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="结束时间" prop="endTime">
                       <el-date-picker v-model="formData.endTime"  @change="getHour(formData.recipientsTime,formData.endTime)"
                        value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="结束时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="时长" prop="timeLang">
                        <el-input v-model="formData.timeLang"  placeholder="时长"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                 <!-- {{formData.useItems}} -->
                <el-col :span="12">
                    <el-form-item label="印章种类" prop="useItems">
                         <el-select style="width:100%;" clearable v-model="formData.useItems" placeholder="请选择印章种类">
                            <el-option
                                v-for="item in onOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value" :disabled=" item.label == '党支部章' && formData.organName !='综合管理部' ">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
               <!-- :style="{display:(formData.useItems=='公章'?'black':'none')}"  -->
                <el-col :span="12" >
                    <el-form-item label="类型" :prop="formData.useItems=='gongzhang'?'sealType':''">
                       <el-select style="width:100%;" clearable v-model="formData.sealType" placeholder="请选择类型" 
                       :disabled="formData.useItems=='gongzhang'?false:true">
                           <el-option
                                v-for="item in typeOption"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
           
            <el-row>
                <el-col :span="12">
                    <el-form-item label="是否外借" prop="lendOutType">
                        <span style="float:left">
                             <el-radio v-model="formData.lendOutType" label="1">是</el-radio>
                             <el-radio v-model="formData.lendOutType" label="0">否</el-radio>
                        </span>
                    </el-form-item>
                </el-col>
               <el-col :span="12">
                    <el-form-item label="陪同人" :prop="formData.lendOutType=='1'?'accompanyingPerson':''">
                        <!-- multiple filterable readonly default-first-option -->
                       <el-select style="width:100%;" v-model="formData.accompanyingPerson"  placeholder="请选择陪同人">
                            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                   
                </el-col>
              </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="用印明细">
                        <div style="float: right;">
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem()" style="margin-right: 5px;"></el-button>
                            <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem()"></el-button>
                        </div>
                        <el-table :data="formData.usingApproval" border style="width: 100%; margin-top: 5px;color:black"
                         @selection-change="handleSelectionChange" 
                          :row-class-name="tableRowClassName"
                          @row-click='show'
                          >
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column prop="fileName"  label="用印文件名称">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.fileName"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="useReason" width="250" label="使用事由">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.useReason"></el-input>
                                </template>
                            </el-table-column>
                        
                            <el-table-column prop="fileNum" width="110" label="用印份数">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.fileNum" ></el-input>
                                </template>
                            </el-table-column>
                             <el-table-column  label="附件" width="150" align="center">
                                <template slot-scope="scope" >
                                    <el-upload  name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" 
                                    :on-success="handleSuccess"
                                     :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <div v-for="item in scope.row.attachments" :key="item.id" class="opertes">
                                         <!-- @getId="getId" -->
                                        <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachmentsone(scope.$index)"></FilesOperate>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
             </el-row> 
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
        <el-button type="default" @click="saveFormValidate()">保存</el-button>
        <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
    </div>
    </el-dialog>
  
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from "moment";
import FilesOperate from "../FilesOperate";
import { application } from "../application.js";
import { publicMethods } from "../application.js";
import { debug, debuglog } from 'util';
export default {
    mixins: [publicMethods],
    name: "ApprovalForm",
    data() {
        return {
             dialogTitle:"",
            dialogSelectCode:false,
            currentRoles:[],
            branchCode:"",
            users:[],
            listId:"",
            counts: 0,
            dialogFormVisible: false,
            formData: this.resetForm(),
            uploadImageType:'',
            users: [],
            selectionItems:[],
            appFlowName: "motor-usingapproval_seal",
            rules: {
                useItems: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入印章种类"
                    }
                ],
                sealType: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入类型"
                    }
                ],
                timeLang: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "时长"
                    }
                ],
                creatorName: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入申请人"
                    }
                ],
                lendOutType: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "是否外借"
                    }
                ],
                accompanyingPerson: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "陪同人"
                    }
                ],

                recipientsTime: [
                    {
                        required: true, //是否必填
                        message: "请选择领用时间",
                        trigger: "blur"
                    }
                ],
                endTime:[
                    {
                        required: true, //是否必填
                        message: "请选择结束时间",
                        trigger: "blur"
                    }
                ],
                useReason: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入使用事由"
                    }
                ],
                fileName: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入用印文件名称"
                    }
                ],
               
                fileNum: [
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
   
            },
            
            onOption: [
                 {
                    value: 'farenzhang',
                    label: '法人章'
                },
                {
                    value: 'dangzhibuzhang',
                    label: '党支部章'
                },
                {
                    value: 'gongzhang',
                    label: '公章'
                },
                {
                    value: 'hetongzhang',
                    label: '合同章'
                },
                {
                    value: 'gonghuizhang',
                    label: '工会章'
                },
                {
                    value: 'yingyezhizhao',
                    label: '营业执照'
                },
                {
                    value: 'jingshenweizhang',
                    label: '经审委印章'
                },
            ],
            typeOption: [
                {
                    value: 'baifanghan',
                    label: '拜访函(企业)'
                },
                {
                    value: 'renliziyuan',
                    label: '人力资源模板文件'
                },
                {
                    value: 'richangxingzheng',
                    label: '日常行政管理'
                },
                // {
                //     value: '工会章',
                //     label: '工会章'
                // },
                {
                    value: 'others',
                    label: '其它'
                }
            ],
        };
    },
     watch: {
   
    },
    components: {
        FilesOperate
    },
    methods: {
         deleteAttachmentsone(index) {
            //  debugger
            let $self = this;
            $self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                 $self.formData.usingApproval[index].attachments.splice(0, 1);
                
            });
        },
        // 时长
        getHour(a1,a2) {
            const $self = this;
            var date3 = new Date(a2.replace(/-/g, '/')).getTime() - new Date(a1.replace(/-/g, '/')).getTime();   //时间差的毫秒数   
            //计算出相差天数  
            var days=Math.floor(date3/(24*3600*1000))  
           //计算出小时数  
           var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数  
            var hours=(leave1/(3600*1000)).toFixed(1)  
            if(a1==null || a2 ==null || a1=='' || a2==''){
                this.formData.timeLang=''
            }
            else{
                if(days*24+new Number(hours)<0){
                    $self.msgTips("结束时间不能在开始时间之前", "error");
                    this.formData.timeLang=''
                    this.formData.endTime=''
                }
                else{
                    this.formData.timeLang=days*24+new Number(hours)
                }
            }
            return hours
        },
         handleSelectionChange(selection) {
            this.selectionItems = selection;
            // debugger
         },
        addItem() {
             this.formData.usingApproval.push({
                id: '',
                fileName: '',
                useReason: '',
                fileNum: '',
                attachments: [],
                count: ++this.counts
            });
            this.formData.count = this.formData.count + 1;
        },
        deleteItem() {
            const self = this;
            if (self.selectionItems.length > 0) {
                self
                    .$confirm('是否删除?', '提示', { type: 'warning' })
                    .then(() => {
                       self.selectionItems.forEach(function (oData) {
                        //    debugger
                            // if (oData.id == '') {
                            //     self.formData.usingApproval.forEach(function (
                            //         item,
                            //         index
                            //     ) {
                            //         if (item.count == oData.count) {
                            //             self.formData.usingApproval.splice(index, 1);
                            //         }
                            //     });
                            // } else {
                                axios
                                    .get(
                                        '/api/v1/singApproval/delete/' + self.formData.id+'/'+oData.index, '',
                                        {
                                            headers: {
                                                'Content-type':
                                                    'application/json'
                                            }
                                        }
                                    )
                                    .then(res => {
                                        self.formData.usingApproval.forEach(function (item,index) {
                                            if (item.index == oData.index) {
                                                self.formData.usingApproval.splice(index, 1);
                                            }
                                        });
                                        self.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                    })
                                    .catch(function () {
                                        self.$message({
                                            message: '操作失败',
                                            type: 'error'
                                        });
                                    });
                        //     }
                        });
                    });
            }
        },
        getUserList() {
            axios.get('/api/v1/users', '').then(res => {
                this.users = res.data;
            });
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
            this.branchCode = "";
        },
        resetForm() {
            let formData = {
                usingApproval: [
                    {
                         id: '',
                        count: 0,
                        fileName: '',
                        useReason: '',
                        fileNum: '',
                        attachments: [],
                    }
                ],
                lendOutType:"1",
                useItems: "", //印章种类
                sealType:"",//类型
                creatorName: this.$store.getters.LoginData.uname || '', //申请人
                organName: this.$store.getters.LoginData.oname || '',
                creatorId: this.$store.getters.LoginData.uid || '',
                organId:this.$store.getters.LoginData.oid || '',
                created: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                timeLang:'',//时长
                id: "",
                recipientsTime: "",
                accompanyingPerson: "",
                endTime: ""
            };
            return formData;
        },
        saveFormValidate(type) {
             let compare = true;
            for (let data of this.formData.usingApproval) {
                if (
                    data.useReason == '' ||
                    JSON.stringify(data.fileName) == '' ||
                   JSON.stringify(data.useReason) == '' ||
                    data.fileNum == ''
                ) {
                    compare = false;
                }
            }
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    if(compare){
                        this.saveForm(type);
                    }
                     else {
                        this.msgTips("用印明细不完整，请填写完整！", "warning");
                    }
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
            let response = await $self.saveFormData(
                "/api/v1/singApproval/save",
                $self.formData
            );
            if (response) {
                $self.formId = response.data.content.id;
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
        tableRowClassName ({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
        show(row, event, column){
            this.uploadImageType=row.index
        },
        handleSuccess(response, file, fileList ) {
            // debugger
            const self = this;
            const aaa=self.uploadImageType
            if (response.length > 0) {
                response.forEach(function(item,index) {
                    // self.formData.attachments.push(item);
                //    filelist.forEach(function(val,index){
                        self.formData.usingApproval[aaa].attachments.push(item);
                    // })
                });
            }
            // this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        
        handlePreview() {},
        handleRemove() {}
    },
    mounted() {
        this.getUserList()
    }
};
</script>
<style scoped>
#ApprovalForm  >>> .el-date-editor{
        width: calc(100% - 0px);
    }
</style>

<style lang="scss" scoped>
#ApprovalForm {
    .uploadBtn {
        margin: 0px auto;
        width: 70px;
        height: 70px;
        text-align: center;
        border: 1px solid #c0c4cc;
        border-radius: 2px;
        cursor: pointer;

        .el-upload {
            width: 100%;
            height: 100%;

            i {
                font-size: 40px;
                margin-top: 20px;
            }
        }
    }
    .opertes{
        margin: 7px auto;
        width: 100px;
        height: 150px;
    }
    input[type=number]::-webkit-inner-spin-button,  
    input[type=number]::-webkit-outer-spin-button {  
    -webkit-appearance: none;
}
}
</style>