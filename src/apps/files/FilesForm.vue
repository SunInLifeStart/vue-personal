<template>
    <el-dialog title="名片印刷" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="FilesForm">
            <el-form ref="formupdate" :model="formData" :rules="rules" label-width="110px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名" prop="proposer">
                            <el-select v-model="formData.proposer" placeholder="请选择" @change="payeeChange" filterable>
                                <el-option v-for="item in payeePeople" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="部门" prop="applyDept">
                            <el-select v-model="formData.applyDept" placeholder="请选择" filterable>
                                <el-option v-for="item in payeeOrgan" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请日期" prop="applyDate">
                            <el-date-picker v-model="formData.applyDate" type="date"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="formData.remark"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="印刷明细">
                            <div style="float: right;">
                                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem()" style="margin-right: 5px;"></el-button>
                                <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem()"></el-button>
                            </div>
                            <el-table :data="formData.detail" border style="width: 100%; margin-top: 5px;" @selection-change="handleSelectionChange">
                               <el-table-column type="selection"></el-table-column>
                                <el-table-column prop="name" label="姓名">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.name"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="specification" label="部门">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.specification"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="number" label="职务">
                                    <template slot-scope="scope">
                                        <el-input v-model.number="scope.row.number"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="数量（盒）">
                                    <template slot-scope="scope">
                                        <el-input v-model.number="scope.row.price"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="totalPrice" label="电话">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.totalPrice" ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="inventory" label="座机号">
                                    <template slot-scope="scope">
                                         <!-- @mousewheel.native.prevent -->
                                        <el-input v-model.number="scope.row.inventory" type="number"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="buyTime" label="邮箱" >
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.buyTime" ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="reason" label="公司名称">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.reason"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="inventory" label="通讯地址">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.inventory" ></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="inventory" label="邮编">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.inventory"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
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
                </el-row>
            </el-form>
            <el-dialog title="用途及申购原因" :append-to-body="true" :visible.sync="purposeDialog" max-width="1000px" width="40%">
                <el-form ref="purposedate" label-width="0px">
                    <el-form-item label="" prop="title">
                        <el-input type="textarea" v-model="inputreason" :autosize="{minRows: 5}"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="default" @click="purposeDialog= false">取消</el-button>
                    <el-button type="primary" @click="submitReason">确定</el-button>
                </div>
            </el-dialog>
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
            appFlowName: "files-form_files",
            counts: 0,
            dialogFormVisible: false,
            purposeDialog: false,
            resonindex: -1,
            inputreason: '',
            formData: this.resetForm(),
            payeePeople: [],
            payeeOrgan: [],
            assetTypes: [
                {
                    id: '01',
                    name: '租赁资产',
                },
                {
                    id: '02',
                    name: '固定资产',
                },
                {
                    id: '03',
                    name: '低值易耗品',
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
    props: ['formId', 'operationType'],
    mounted() {
        this.getUsers();
    },
    methods: {
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
                        buyTime: '',
                        reason: '',
                        inventory: ''
                    }
                ],
                attachments: [],
                applyDate: moment(new Date()).format('YYYY-MM-DD'),
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
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function (item) {
                    self.formData.attachments.push(item);
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
            this.purposeDialog = false;
            this.formData.detail[this.resonindex].reason = this.inputreason;
        },
        inputReason(item, index) {
            this.resonindex = -1;
            this.inputreason = item.reason;
            this.purposeDialog = true;
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
                buyTime: '',
                reason: '',
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