<template>
    <el-dialog title="文件印刷" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="75%" style="text-align: center;">
        <div id="FilesForm">
            <el-form ref="formupdate" :model="formData" :rules="rules" label-width="90px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="申请人" prop="proposer">
                            <!-- <el-select v-model="formData.proposer" placeholder="请选择" @change="payeeChange" filterable>
                                <el-option v-for="item in payeePeople" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select> -->
                            <el-input v-model="formData.proposer" placeholder="请输入申请人" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="部门" prop="applyDept">
                            <!-- <el-select v-model="formData.applyDept" placeholder="请选择" filterable>
                                <el-option v-for="item in payeeOrgan" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select> -->
                             <el-input v-model="formData.applyDept" placeholder="请输入部门" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请日期" prop="applyDate">
                            <el-input v-model="formData.applyDate" placeholder="请输入申请时间" :disabled="true"></el-input>
                         </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="资金计划所属月份" label-width="89px">
                            <!-- <el-input v-model="formData.apply" placeholder="资金计划所属月份"></el-input> -->
                            <el-select v-model="formData.yuefen" placeholder="请选择月份" @change="payeeChange" clearable filterable>
                                <el-option v-for="item in onOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否属于年度预算内" style="float:left"  label-width="166px">
                            <el-radio v-model="formData.type" label="true">是</el-radio>
                             <el-radio v-model="formData.type" label="false">否</el-radio>
                        </el-form-item>
                    </el-col>
                  <el-col :span="24">
                        <el-form-item label="文件印刷明细" label-width="104px">
                            <div style="float: right;">
                                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem()" style="margin-right: 5px;"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem()"></el-button>
                            </div>
                            <el-table :data="formData.detail" border style="width: 100%; margin-top: 5px;"
                               @selection-change="handleSelectionChange"
                               :row-class-name="tableRowClassName"
                               @row-click='show'>
                              <el-table-column type="selection" width="70px"></el-table-column>
                                <el-table-column prop="name" label="文件姓名">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.name"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="specification" label="印刷幅面">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.specification"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="印刷数量（套）">
                                    <template slot-scope="scope">
                                        <el-input v-model.number="scope.row.price" @change="totleCurrency" placeholder=""></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="totalPrice" label="印刷色彩">
                                    <template slot-scope="scope">
                                        <!-- <el-input v-model="scope.row.totalPrice" ></el-input> -->
                                        <el-radio v-model="formData.lendOutType" label="1">彩色</el-radio>
                                       <el-radio v-model="formData.lendOutType" label="0">白色</el-radio>
                                    </template>
                                </el-table-column>
                               <el-table-column prop="specification" label="其他需求">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.qita"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="specification" label="附件">
                                    <template slot-scope="scope">
                                        <el-upload  name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" 
                                        :on-success="handleSuccess"
                                        :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <div v-for="item in scope.row.attachments" :key="item.id" class="opertes">
                                            <!-- @getId="getId" -->
                                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}"></FilesOperate>
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
                            <el-input v-model="formData.numbers" :disabled="true"  placeholder="印刷数量"></el-input>
                        </el-form-item>
                    </el-col>
               </el-row>
               <!-- <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,download:true,del:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row> -->
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
import axios from 'axios';
import cookies from 'js-cookie';
export default {
    mixins: [publicMethods],
    name: 'FilesForm',
    data() {
        return {
            uploadImageType:'',
            appFlowName: "files-form_files",
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
                    value: 'yiyue',
                    label: '一月'
                },
                {
                    value: 'eryue',
                    label: '二月'
                },
                {
                    value: 'sanyue',
                    label: '三月'
                },
                {
                    value: 'siyue',
                    label: '四月'
                },
                {
                    value: 'wuyue',
                    label: '五月'
                },
                {
                    value: 'liuyue',
                    label: '六月'
                },
                {
                    value: 'qiyue',
                    label: '七月'
                },
                {
                    value: 'bayue',
                    label: '八月'
                },
                {
                    value: 'jiuyue',
                    label: '九月'
                },
                {
                    value: 'shiyue',
                    label: '十月'
                },
                {
                    value: 'shiyiyue',
                    label: '十一月'
                },
                {
                    value: 'shieryue',
                    label: '十二月'
                },
            ],
            cookie_uname: '',
            cookie_oname: '',
            selectionItems: [],
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            // createForm_status: false,
            rules: {
                proposer: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入姓名"
                    }
                ],
                applyDept: [
                    {
                        required: true, //是否必填
                        trigger: "blur", //何事件触发
                        message: "请输入部门"
                    }
                ],
                applyDate: [
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
          this.formData.numbers = val ? this.totleCurrency(val) : "";
      }
    },

    props: ['formId', 'operationType'],
    mounted() {
        this.getUsers();
    },
    methods: {
        // 总数量
        totleCurrency(totle){
            let totalCount=0;
             for(let i=0;i<this.formData.detail.length;i++){
                    if(this.formData.detail[i].price){
                        totalCount += this.formData.detail[i].price;
                    }
                
                }
                this.formData.numbers=totalCount.toFixed(1)
                return totalCount.toFixed(1)
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
                detail: [
                    {
                        id: '',
                        count: 0,
                        name: '',
                        specification: '',
                        number: '',
                        price: '',
                        totalPrice: '',
                        email: '',
                        attachments: [],
                        reason: cookies.get('uname'),//公司
                        inventory:cookies.get('uname'),//通讯地址
                        ubian:cookies.get('uname'),//邮编
                        //  cookies.get('uname'),//座机
                    }
                ],
                numbers:"",
                type:'true',
                creatorName: this.$store.getters.LoginData.uname || '', //申请人
                organName: this.$store.getters.LoginData.oname || '',
                creatorId: this.$store.getters.LoginData.uid || '',
                organId:this.$store.getters.LoginData.oid || '',
                applyDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                proposerId: '',
                applyDeptId: '',
                proposer: cookies.get('uname'),
                applyDept: cookies.get('oname'),
                supplyCode: '',//资产类型-流程判断
                inbuget: true,
            };
            return formData;
        },

        saveFormValidate(type) {
            // if (this.formData.plan && this.formData.budget) {
            //     this.formData.inbuget = true;
            // } else {
            //     this.formData.inbuget = false;
            // }
            let compare = true;
            for (let data of this.formData.detail) {
                if (
                    data.name == '' ||
                    data.number == '' ||
                    data.reason == '' ||
                    data.price == '' || 
                    data.inventory == ''
                ) {
                    compare = false;
                }
            }
            this.$refs["formupdate"].validate(valid => {
                if (valid) {
                    if (compare) {
                        this.saveForm(type);
                    } else {
                        alert('请输入采购明细');
                    }
                }
            });
        },
        // 提交保存
        async saveForm(params) {
            const $self = this;
            let response = await $self.saveFormData("/api/v1/files_forms/save", $self.formData);
            this.totleCurrency()
            if (response) {
                $self.formId = response.data.id;
                $self.dialogFormVisible = false;
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
                    $self.msgTips("提交失败", "warning");
                } else {
                    $self.msgTips("保存失败", "warning");
                }
            }
        },
         tableRowClassName ({row, rowIndex}) {
            //把每一行的索引放进row
            row.index = rowIndex;
        },
         show(row, event, column){
            //  debugger
            this.uploadImageType=row.index
        },
        handleSuccess(response, file,fileList) {
            // debugger
            const self = this;
            const aaa=self.uploadImageType
            const bbb=self.formData.detail[aaa]
            if (response.length > 0) {
                response.forEach(function (item,index) {
                    // self.formData.attachments.push(item);
                    self.formData.detail[aaa].attachments.push(item);
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
        submitReason() {
            // this.purposeDialog = false;
            this.formData.detail[this.resonindex].reason = this.inputreason;
        },
        inputReason(item, index) {
            this.resonindex = -1;
            this.inputreason = item.reason;
            // this.purposeDialog = true;
            this.resonindex = index;
        },
        //选择的人变化
        payeeChange(val) {
            this.formData.applyDept = '';
            for (let data of this.payeePeople) {
                if (data.name == val) {
                    this.payeeOrgan = data.organs;
                }
            }
            if (this.payeeOrgan.length == 1) {
                this.formData.applyDept = this.payeeOrgan[0].name;
            }
        },
        //计算合计金额
        getAmount(row) {
            if (row.number != null && row.price != null) {
                row.totalPrice = this.common.toDecimal2(row.number * row.price);
            } else {
                row.totalPrice = 0;
            }
        },
        addItem() {
            this.formData.detail.push({
                id: '',
                name: '',
                specification: '',
                number: '',
                price: '',
                totalPrice: '',
                email: '',
                reason: '',
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
                            if (oData.id == '') {
                                self.formData.detail.forEach(function (
                                    item,
                                    index
                                ) {
                                    if (item.count == oData.count) {
                                        self.formData.detail.splice(index, 1);
                                    }
                                });
                            } else {
                                axios
                                    .delete(
                                        '/api/v1/files_forms/deleteDetail/' +
                                        oData.id,
                                        '',
                                        {
                                            headers: {
                                                'Content-type':
                                                    'application/json'
                                            }
                                        }
                                    )
                                    .then(res => {
                                        self.formData.detail.forEach(function (
                                            item,
                                            index
                                        ) {
                                            if (item.id == oData.id) {
                                                self.formData.detail.splice(
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