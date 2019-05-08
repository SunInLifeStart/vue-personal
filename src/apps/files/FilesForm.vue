<template>
    <el-dialog title="文件印刷" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="85%" style="text-align: center;">
        <div id="FilesForm">
            <el-form ref="formupdate" :model="formData" :rules="rules" label-width="90px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="申请人" prop="creatorName">
                            <el-input v-model="formData.creatorName" placeholder="请输入申请人" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="部门" prop="organName">
                            <el-input v-model="formData.organName" placeholder="请输入部门" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请日期" prop="created">
                            <el-input v-model="formData.created" placeholder="请输入申请时间" :disabled="true"></el-input>
                         </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="资金计划所属月份" >
                            <!-- <el-input v-model="formData.apply" placeholder="资金计划所属月份"></el-input> -->
                            <el-select v-model="formData.umonth" placeholder="请选择月份"  clearable filterable>
                                <el-option v-for="item in onOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="是否属于年度预算内" label-width="166px">
                            <el-radio v-model="formData.utype" label="true">是</el-radio>
                             <el-radio v-model="formData.utype" label="false">否</el-radio>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                        <el-form-item label="文件印刷明细" label-width="104px">
                            <div style="float: right;">
                                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem()" style="margin-right: 5px;"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem()"></el-button>
                            </div>
                            <el-table :data="formData.cardPrinting" border style="width: 100%; margin-top: 5px;"
                               @selection-change="handleSelectionChange"
                               :row-class-name="tableRowClassName"
                               @row-click='show'>
                              <el-table-column type="selection" width="60px"></el-table-column>
                                <el-table-column prop="fileName" label="文件名称">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.fileName"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="printingPicture" label="印刷幅面">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.printingPicture"></el-input>
                                    </template>
                                </el-table-column>
                                <!-- cardPrinting.printNumber -->
                                <!-- :prop="'cardPrinting.' + scope.$index + '.printNumber'" :rules='rules.printNumber' -->
                                <el-table-column  label="印刷数量（套）" width="110px">
                                    <template slot-scope="scope">
                                        <el-input v-model.number="scope.row.printNumber" @change="totleCurrency" placeholder=""></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="印刷色彩" width="110px">
                                    <template slot-scope="scope">
                                       <el-radio v-model="scope.row.colourType" label="1">彩色</el-radio>
                                       <el-radio v-model="scope.row.colourType" label="0">白色</el-radio>
                                    </template>
                                </el-table-column>
                               <el-table-column prop="demand" label="其他需求">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.demand"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="" label="附件">
                                    <template slot-scope="scope">
                                        <el-upload  name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" 
                                        :on-success="handleSuccess"
                                        :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <div v-for="(item,index) in scope.row.attachments" :key="index" class="opertes">
                                           <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments(index,scope.row.attachments)"></FilesOperate>
                                        </div>
                                    </template>
                                     
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="总印刷数量（套）" >
                            <el-input v-model="formData.allPrintNumber" :disabled="true"  placeholder="印刷数量"></el-input>
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
import moment from "moment";
import FilesOperate from "../FilesOperate";
import { application } from "../application.js";
import { publicMethods } from "../application.js";
import axios from 'axios';
import cookies from 'js-cookie';
export default {
    mixins: [publicMethods],
    name: 'FilesForm',
    data() {
        return {
            dialogTitle:"",
            dialogSelectCode:false,
            currentRoles:[],
            branchCode:"",
            uploadImageType:'',
            appFlowName: "motor-documentprinting_documentprint",
            counts: 0,
            dialogFormVisible: false,
            purposeDialog: false,
            resonindex: -1,
            inputreason: '',
            formData: this.resetForm(),
            payeePeople: [],
            payeeOrgan: [],
            onOption: [
                {
                    value: '一月',
                    label: '一月'
                },
                {
                    value: '二月',
                    label: '二月'
                },
                {
                    value: '三月',
                    label: '三月'
                },
                {
                    value: '四月',
                    label: '四月'
                },
                {
                    value: '五月',
                    label: '五月'
                },
                {
                    value: '六月',
                    label: '六月'
                },
                {
                    value: '七月',
                    label: '七月'
                },
                {
                    value: '八月',
                    label: '八月'
                },
                {
                    value: '九月',
                    label: '九月'
                },
                {
                    value: '十月',
                    label: '十月'
                },
                {
                    value: '十一月',
                    label: '十一月'
                },
                {
                    value: '十二月',
                    label: '十二月'
                },
            ],
            cookie_uname: '',
            cookie_oname: '',
            selectionItems: [],
            rules: {
                // printNumber: [
                //     { required: true, message: '请输入数量', trigger: 'blur' }
                // ],
                'positionsWage.sex': [
                    { required: true, message: '请输入性别', trigger: 'blur' }
                ],
                creatorName: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入姓名"
                    }
                ],
                organName: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入部门"
                    }
                ],
                created: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入申请日期"
                    }
                ],
               
            }
        };
    },
    components: {
        FilesOperate
    }, 
    mounted() {
        this.getUsers();
    },
    methods: {
        // 总数量
        totleCurrency(totle){
             let totalCount=0;
             for(let i=0;i<this.formData.cardPrinting.length;i++){
                    if(this.formData.cardPrinting[i].printNumber){
                        totalCount += this.formData.cardPrinting[i].printNumber;
                    }
                }
                this.formData.allPrintNumber=totalCount
                return totalCount
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
                cardPrinting: [
                    {
                        id: '',
                        count: 0,
                        fileName: '',
                        demand: '',
                        colourType:'0',
                        printNumber:"",
                        printingPicture: '',
                        attachments: [],
                    }
                ],
                allPrintNumber: '',
                umonth:"",
                utype:'true',
                status:"",
                creatorName: this.$store.getters.LoginData.uname || '', //申请人
                organName: this.$store.getters.LoginData.oname || '',
                creatorId: this.$store.getters.LoginData.uid || '',
                organId:this.$store.getters.LoginData.oid || '',
                created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                proposerId: '',
                applyDeptId: '',
                creatorName: cookies.get('uname'),
                supplyCode: '',//资产类型-流程判断
                inbuget: true,
            };
            return formData;
        },
         saveFormValidate(type) {
            let compare = true;
            for (let data of this.formData.cardPrinting) {
                if (
                    data.fileName == '' ||
                    data.demand == '' ||
                    data.colourType == '' ||
                     data.printNumber == '' ||
                    data.printingPicture == ''
                   
                ) {
                    compare = false;
                }
            }
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    if (compare) {
                        this.saveForm(type);
                    } else {
                        this.msgTips('文件印刷明细不完整，请填写完整！', 'warning');
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
            let response = await $self.saveFormData("/api/v1/documentPrinting/save", $self.formData);
            this.totleCurrency()
            if (response) {
                $self.formId = response.data.content.id;
                // $self.dialogFormVisible = false;
                 $self.dialogFormVisible = $self.dialogSelectCode =  false;
                if (params) {
                    $self.msgTips("提交成功", "success");
                    console.log(this.createForm_status)
                    if (this.createForm_status) {
                        $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {
                        let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                        console.log('actions', actions.data)
                        actions.data.types = actions.data.types.filter(
                            function (item) {
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
        handleSuccess(response, file,fileList) {
            const self = this;
            const aaa=self.uploadImageType
            const bbb=self.formData.cardPrinting[aaa]
            if (response.length > 0) {
                response.forEach(function (item,index) {
                   self.formData.cardPrinting[aaa].attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() { },
        handleRemove() { },
         //获取申请人列表
        getUsers() {
            axios.get('/api/v1/users').then(res => {
                this.payeePeople = res.data;
            });
        },
        
        //选择的人变化
        payeeChange(val) {
            this.formData.organName = '';
            for (let data of this.payeePeople) {
                if (data.name == val) {
                    this.payeeOrgan = data.organs;
                }
            }
            if (this.payeeOrgan.length == 1) {
                this.formData.organName = this.payeeOrgan[0].name;
            }
        },
       addItem() {
            this.formData.cardPrinting.push({
                id: '',
                fileName: '',
                demand: '',
                colourType:'0',
                printNumber:"",
                printingPicture: '',
                attachments: [],
                count: ++this.counts
            });
            this.formData.count = this.formData.count + 1;
        },
        deleteItem() {
            const self = this;
            if (self.selectionItems.length > 0) {
                self.$confirm('是否删除?', '提示', { type: 'warning' }) .then(() => {
                        self.selectionItems.forEach(function (oData) {
                                axios.get('/api/v1/documentPrinting/delete/' + self.formData.id+'/'+oData.index,'',
                                        {
                                            headers: {
                                                'Content-type':
                                                    'application/json'
                                            }
                                        }
                                    )
                                    .then(res => {
                                        self.formData.cardPrinting.forEach(function (item,index) {
                                            if (item.index == oData.index) {
                                                self.formData.cardPrinting.splice(index,1);
                                                self.$message({
                                                    message: '删除成功',
                                                    type: 'success'
                                                });
                                            }
                                        });
                                    })
                                    .catch(function () {
                                        self.$message({
                                            message: '操作失败',
                                            type: 'error'
                                        });
                                    });
                        });
                    });
            }
        },
        handleSelectionChange(selection) {
            this.selectionItems = selection;
        },
        
    },
    watch: {
       
    }
};
</script>
<style scoped>
#FilesForm  >>> .el-select{
        width: calc(100% - 8px);
    }
     #FilesForm >>> .el-form-item__content{
        width: calc(100% - 80px);
    }
     #FilesForm >>> .el-checkbox{
         width: 30px;
    }
</style>

<style lang="scss" scoped>
#FilesForm {
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
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
}
</style>