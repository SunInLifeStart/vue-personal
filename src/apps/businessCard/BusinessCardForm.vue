<template>
    <el-dialog title="名片印刷" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="95%" style="text-align: center;">
        <div id="BusinessCardForm">
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
                        <el-form-item label="申请日期" prop="committed">
                            <!-- <el-date-picker v-model="formData.committed" type="date"></el-date-picker> -->
                             <el-input v-model="formData.committed" placeholder="请输入申请时间" :disabled="true"></el-input>
                         </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="资金计划所属月份" >
                             <!-- @change="payeeChange" -->
                            <el-select v-model="formData.umonth" placeholder="请选择月份" clearable filterable>
                                <el-option v-for="item in onOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否属于年度预算内" label-width="140px" style="margin-left:40px">
                            <el-radio v-model="formData.utype" label='1'>是</el-radio>
                             <el-radio v-model="formData.utype" label='0'>否</el-radio>
                        </el-form-item>
                    </el-col>
                 </el-row>
                 <el-row>
                    <el-col :span="24">
                        <el-form-item label="名片印刷明细" label-width="100px" :rules="rulesform" :model="formData">
                            <div style="float: right;">
                                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem()" style="margin-right: 5px;"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem()"></el-button>
                            </div>
                            <el-table :data="formData.cardPrinting" border style="width: 100%; margin-top: 5px;" 
                            @selection-change="handleSelectionChange"
                             :row-class-name="tableRowClassName"
                            @row-click='show'>
                               <el-table-column type="selection" width="40px"></el-table-column>
                                <el-table-column label="姓名">
                                    <template slot-scope="scope">
                                         <el-select v-model="scope.row.uname" placeholder="请选择" @change="payeeChange" clearable filterable
                                          allow-create default-first-option>
                                                <el-option v-for="item in payeePeople" :key="item.id" :label="item.name" :value="item.name">
                                                </el-option>
                                            </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="organ" label="部门">
                                    <template slot-scope="scope">
                                       <el-select v-model="scope.row.organ" placeholder="请选择" clearable filterable
                                       allow-create default-first-option>
                                            <el-option v-for="item in payeeOrgan" :key="item.id" :label="item.name" :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="duty" label="职务">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.duty"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="quantity" label="数量（盒）">
                                    <template slot-scope="scope">
                                        <el-input v-model.number="scope.row.quantity" @change="totleCurrency" placeholder="至少2盒"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="phone" label="电话">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.phone" ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="telephone" label="座机号">
                                    <template slot-scope="scope">
                                         <!-- @mousewheel.native.prevent -->
                                        <el-input v-model="scope.row.telephone" type="number"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="mailbox" label="邮箱" >
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.mailbox" ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="company" label="公司名称">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.company"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="mailingAddress" label="通讯地址">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.mailingAddress" ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="postcode" label="邮编">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.postcode"></el-input>
                                    </template>
                                </el-table-column>
                                 <el-table-column prop="" label="附件">
                                    <template slot-scope="scope">
                                        <el-upload  name="files" class="upload-demo uploadBtn" style="width:70px;height:110px" ref="upload" action="/api/v1/files/upload" 
                                        :on-success="handleSuccess"
                                        :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <div v-for="item in scope.row.attachments" :key="item.id" class="opertes">
                                           <FilesOperate  :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachmentsone(scope.$index)"></FilesOperate>
                                        </div>
                                    </template>
                                     
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="总印刷数量" >
                            <el-input v-model="formData.totlenumbers" :disabled="true"  placeholder="印刷数量"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- <el-dialog title="用途及申购原因" :append-to-body="true" :visible.sync="purposeDialog" max-width="1000px" width="40%">
                <el-form ref="purposedate" label-width="0px">
                    <el-form-item label="" prop="title">
                        <el-input type="textarea" v-model="inputreason" :autosize="{minRows: 5}"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="default" @click="purposeDialog= false">取消</el-button>
                    <el-button type="primary" @click="submitReason">确定</el-button>
                </div>
            </el-dialog> -->
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
    name: 'BusinessCardForm',
    data() {
        return {
            dialogTitle:"",
            dialogSelectCode:false,
            currentRoles:[],
            branchCode:"",
            appFlowName: "motor-cardprinting_cardprint",
            counts: 0,
            dialogFormVisible: false,
            purposeDialog: false,
            resonindex: -1,
            inputreason: '',
            uploadImageType:'',
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
            rulesform:{
                name: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入姓名"
                    }
                ],
            },
            rules: {
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
                committed: [
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
    watch: {
      'formData.lowercase'(val) {
          this.formData.totlenumbers = val ? this.totleCurrency(val) : "";
      }
    },
     mounted() {
        this.getUsers();
    },
    methods: {
         deleteAttachmentsone(index) {
           let $self = this;
            $self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                 $self.formData.cardPrinting[index].attachments.splice(0, 1);
            });
        },
        // 总数量
        totleCurrency(totle){
            // debugger
            let totalCount=0;
             for(let i=0;i<this.formData.cardPrinting.length;i++){
                    if(this.formData.cardPrinting[i].quantity){
                        totalCount += this.formData.cardPrinting[i].quantity;
                    }
                }
                this.formData.totlenumbers=totalCount
                return totalCount
        },
        //选择资产类型
        typeChange(val) {
            if (val == '租赁资产') {
                this.formData.supplyCode = 'lease';
            } else if (val == '固定资产') {
                this.formData.supplyCode = 'fixed';
            } else if (val == '低值易耗品') {
                this.formData.supplyCode = 'low';
            }
        },
        tableRowClassName ({row, rowIndex}) {
            //把每一行的索引放进row
            row.index = rowIndex;
        },
        show(row, event, column){
            this.uploadImageType=row.index
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
                        uname: this.$store.getters.LoginData.uname || '',//姓名
                        organ: this.$store.getters.LoginData.oname || '',
                        duty:'',//职务
                        quantity:null,//数量
                        phone: '',
                        telephone:'',
                        mailbox: '',
                        company: '',//公司
                        mailingAddress:'',//通讯地址
                        postcode:'',//邮编
                        attachments: [],
                    }
                ],
                totlenumbers:"",// 流水号
                processId:'',
                id: "",
                status:'',
                umonth:'',//月份
                utype:'1',
                
                creatorName: this.$store.getters.LoginData.uname || '', //申请人
                organName: this.$store.getters.LoginData.oname || '',
                creatorId: this.$store.getters.LoginData.uid || '',
                organId:this.$store.getters.LoginData.oid || '',
                committed: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                proposer: cookies.get('uname'),
                // organName: cookies.get('oname'),
                supplyCode: '',//资产类型-流程判断
            };
            return formData;
        },
         saveFormValidate(type) {
           let compare = true;
            for (let data of this.formData.cardPrinting) {
                if (
                    data.uname == '' ||
                    data.postcode == '' ||
                    data.company == '' ||
                    data.quantity == '' || 
                    data.mailingAddress == ''||
                    data.telephone == '' ||
                    data.phone == '' ||
                    data.duty == '' || 
                    data.organ == ''|| 
                    data.mailbox == ''
                ) {
                    compare = false;
                }
            }
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    if (compare) {
                        this.saveForm(type);
                    } else {
                        this.msgTips('名片印刷明细不完整，请填写完整！', 'warning');
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
            let response = await $self.saveFormData("/api/v1/cardPrinting/save", $self.formData);
            this.totleCurrency()
            if (response) {
                $self.formId = response.data.content.id;
                $self.dialogFormVisible = $self.dialogSelectCode =  false;
                // $self.dialogFormVisible = false;
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
        handleSuccess(response, file) {
           
             const self = this;
            const aaa=self.uploadImageType
            const bbb=self.formData.cardPrinting[aaa]
            if (response.length > 0) {
                response.forEach(function (item,index) {
                   self.formData.cardPrinting[aaa].attachments.push(item);
                });
            }
            this.$refs.upload.clearFiles();
            // this.$refs.upload.clearBusinessCard();
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
        submitReason() {
            // this.purposeDialog = false;
            this.formData.cardPrinting[this.resonindex].company = this.inputreason;
        },
        
        //选择的人变化
        payeeChange(val) {
            // debugger
            // this.formData.organName = '';
            this.formData.cardPrinting.forEach(item=>{
                item.organ=''
            })
            for (let data of this.payeePeople) {
                if (data.name == val) {
                    this.payeeOrgan = data.organs;
                }
            }
            if (this.payeeOrgan.length == 1) {
                // this.formData.organName = this.payeeOrgan[0].name;
                this.formData.cardPrinting.forEach(item=>{
                item.organ=this.payeeOrgan[0].name;
            })
            }
        },
        
        addItem() {
            this.formData.cardPrinting.push({
                id: '',
                uname: this.$store.getters.LoginData.uname || '',//姓名
                organ: this.$store.getters.LoginData.oname || '',
                duty:'',//职务
                quantity:'',//数量
                phone: '',
                telephone:'',
                mailbox: '',
                mailingAddress:'',
                company: '',
                postcode:'',
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
                            // debugger
                            // if (oData.id == '') {
                            //     self.formData.cardPrinting.forEach(function (
                            //         item,
                            //         index
                            //     ) {
                            //         if (item.count == oData.count) {
                            //             self.formData.cardPrinting.splice(index, 1);
                            //         }
                            //     });
                            // } else {
                                axios
                                    .get(
                                        '/api/v1/cardPrinting/delete/' + self.formData.id+'/'+oData.index,
                                        '',
                                        {
                                            headers: {
                                                'Content-type':
                                                    'application/json'
                                            }
                                        }
                                    )
                                    .then(res => {
                                        self.formData.cardPrinting.forEach(function (
                                            item,
                                            index
                                        ) {
                                            if (item.index == oData.index) {
                                                self.formData.cardPrinting.splice(
                                                    index,
                                                    1
                                                );
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
                            // }
                        });
                    });
            }
        },
        handleSelectionChange(selection) {
            this.selectionItems = selection;
        },
        getId(id) {
            const self = this;
            if (this.formData.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/files_forms/deleteAttachment/' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.formData.attachments.forEach(function (
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.formData.attachments.splice(
                                            index,
                                            1
                                        );
                                    }
                                });
                            })
                            .catch(function () {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
        },
    },
    watch: {
        'formData.lowercase'(val) {
            this.formData.upper = val ? this.convertCurrency(val) : "";
        }
    }
};
</script>
<style scoped>
#BusinessCardForm  >>> .el-select{
        width: calc(100% - 0px);
    }
     #BusinessCardForm >>> .el-form-item__content{
        width: calc(100% - 80px);
    }
     #BusinessCardForm >>> .el-checkbox{
         width: 30px;
    }
</style>

<style lang="scss" scoped>
#BusinessCardForm {
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