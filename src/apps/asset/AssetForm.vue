<template>
    <div id="AssetForm">
        <el-form ref="selectItem" :model="selectItem" label-width="110px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="申请人" prop="proposer">
                        <el-select v-model="selectItem.proposer" placeholder="请选择" @change="payeeChange" filterable>
                            <el-option v-for="item in payeePeople" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请部门" prop="applyDept">
                        <el-select v-model="selectItem.applyDept" placeholder="请选择" filterable>
                            <el-option v-for="item in payeeOrgan" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请日期" prop="applyDate">
                        <el-date-picker style="width: 100%" v-model="selectItem.applyDate" type="date"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="资产类型" prop="remark">
                       <el-select v-model="selectItem.assetsType" placeholder="请选择" filterable>
                            <el-option v-for="item in assetTypes" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="selectItem.remark"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="采购明细">
                        <div style="float: right;">
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem()" style="margin-right: 5px;"></el-button>
                            <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem()"></el-button>
                        </div>
                        <el-table :data="selectItem.detail" border style="width: 100%; margin-top: 5px;" @selection-change="handleSelectionChange">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column prop="name" label="物品名称">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="specification" label="规格说明">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.specification"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="number" label="计划采购数量">
                                <template slot-scope="scope">
                                    <!-- <el-input v-model="scope.row.number" @input="getAmount(scope.row)"  onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"></el-input> -->
                                    <el-input v-model="scope.row.number" @input="getAmount(scope.row)" type="number"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="price" label="计划单价">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.price" @input="getAmount(scope.row)" onkeyup="this.value=this.value.replace(/[^0-9.]+/,'');"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="totalPrice" label="计划总价">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.totalPrice" disabled></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="inventory" label="库存数量">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.inventory"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="buyTime" label="要求购入时间" width="160px">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.buyTime" type="date" style="width:135px"></el-date-picker>
                                </template>
                            </el-table-column>
                            <el-table-column prop="reason" label="用途及申购原因">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.reason" @focus="inputReason(scope.row,scope.$index)"></el-input>
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
                        <div v-for="item in selectItem.attachments" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,download:true,del:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog title="用途及申购原因" :append-to-body="true" :visible.sync="dialogFormVisible" max-width="1000px" width="40%">
            <el-form ref="formupdate" label-width="0px">
                <el-form-item label="" prop="title">
                    <el-input type="textarea" v-model="inputreason" :autosize="{minRows: 5}"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="dialogFormVisible= false">取消</el-button>
                <el-button type="primary" @click="submitReason">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import FilesOperate from '../FilesOperate';
import cookies from 'js-cookie';
export default {
    name: 'AssetForm',
    data() {
        return {
            counts: 0,
            dialogFormVisible: false,
            resonindex: -1,
            inputreason: '',
            selectItem: {
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
                        reason: ''
                    }
                ],
                attachments: [],
                applyDate: moment(new Date()).format('YYYY-MM-DD'),
                proposerId: '',
                applyDeptId: '',
                proposer: this.cookie_uname,
                applyDept: this.cookie_oname,
                assetType:''//资产类型
            },
            payeePeople: [],
            payeeOrgan: [],
            assetTypes: [
                {
                    id:'01',
                    name:'租赁资产',
                },
                {
                    id:'02',
                    name:'固定资产',
                },
                {
                    id:'03',
                    name:'低值易耗品',
                },
            ],
            cookie_uname: '',
            cookie_oname: '',
            cookie_uid: '',
            cookie_oid: '',
            selectionItems: [],
            currentFormId: this.operationType == 'create' ? '' : this.formId,
        };
    },
    components: {
        FilesOperate
    },
    props: ['formId', 'operationType'],
    mounted() {
        this.getUsers();
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
                self.selectItem.proposer = decodeURIComponent(
                    item.split('=')[1]
                );
            }
            if (item.indexOf('uid') > 0) {
                self.cookie_uid = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
                self.selectItem.applyDept = decodeURIComponent(
                    item.split('=')[1]
                );
            }
            if (item.indexOf('oid') > 0) {
                self.cookie_oid = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
    methods: {
        //获取申请人列表
        getUsers() {
            axios.get('/api/v1/users').then(res => {
                this.payeePeople = res.data;
            });
        },
        submitReason() {
            this.dialogFormVisible = false;
            this.selectItem.detail[this.resonindex].reason = this.inputreason;
        },
        inputReason(item, index) {
            this.resonindex = -1;
            this.inputreason = item.reason;
            this.dialogFormVisible = true;
            this.resonindex = index;
        },
        //选择的人变化
        payeeChange(val) {
            this.selectItem.applyDept = '';
            for (let data of this.payeePeople) {
                if (data.name == val) {
                    this.payeeOrgan = data.organs;
                }
            }
            if (this.payeeOrgan.length == 1) {
                this.selectItem.applyDept = this.payeeOrgan[0].name;
            }
        },
        getForm() {
            this.getUsers();
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/asset_forms/' + this.formId)
                    .then(res => {
                        self.selectItem = res.data;
                        // self.selectItem.proposerId = res.data.proposer;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
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
        saveForm(action) {
            let compare = true;
            for (let data of this.selectItem.detail) {
                if (
                    data.name == '' ||
                    data.number == '' ||
                    data.reason == '' ||
                    data.price == ''
                ) {
                    compare = false;
                }
            }
            if (compare) {
                const self = this;
                this.$emit('saveStatus', false);
                if (this.selectItem.proposer != '') {
                    for (let data of this.payeePeople) {
                        if (data.name == this.selectItem.proposer) {
                            this.selectItem.proposerId = data.id;
                        }
                    }
                }
                if (this.selectItem.applyDept != '') {
                    for (let data of this.payeeOrgan) {
                        if (data.name == this.selectItem.applyDept) {
                            this.selectItem.applyDeptId = data.id;
                        }
                    }
                }
                axios
                    .post(
                        '/api/v1/asset_forms/save',
                        JSON.stringify(this.selectItem),
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
                    .then(res => {
                        self.currentFormId = res.data.id;
                        if (action == 'save') {
                            self.submitForm();
                        } else {
                            self.$emit('refreshData');
                            self.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            } else {
                alert('请输入采购明细');
            }
        },
        submitCheck() {
            this.saveForm('save');
        },
        submitForm() {
            const self = this;
            axios
                .post('/api/v1/assets/' + this.currentFormId + '/create', '', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
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
                    '/api/v1/asset_forms/' +
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
                    self.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT'
            };
            axios
                .put(
                    '/api/v1/assets/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    self.$emit('refreshData');
                    self.comment();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        repealForm() {
            const self = this;
            axios
                .put(
                    '/api/v1/asset_forms/' + this.currentFormId + '/cancel',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.selectItem.attachments.push(item);
                });
            }
        },
        addItem() {
            this.selectItem.detail.push({
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
            this.selectItem.count = this.selectItem.count + 1;
        },
        deleteItem() {
            const self = this;
            if (self.selectionItems.length > 0) {
                self
                    .$confirm('是否删除?', '提示', { type: 'warning' })
                    .then(() => {
                        self.selectionItems.forEach(function(oData) {
                            if (oData.id == '') {
                                self.selectItem.detail.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.count == oData.count) {
                                        self.selectItem.detail.splice(index, 1);
                                    }
                                });
                            } else {
                                axios
                                    .delete(
                                        '/api/v1/asset_forms/deleteDetail/' +
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
                                        self.selectItem.detail.forEach(function(
                                            item,
                                            index
                                        ) {
                                            if (item.id == oData.id) {
                                                self.selectItem.detail.splice(
                                                    index,
                                                    1
                                                );
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
                        });
                    });
            }
        },
        handleSelectionChange(selection) {
            this.selectionItems = selection;
        },
        getId(id) {
            const self = this;
            if (this.selectItem.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .get(
                                '/api/v1/asset_forms/deleteAttachment/' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.selectItem.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.selectItem.attachments.splice(
                                            index,
                                            1
                                        );
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
        clearForm() {
            this.getUsers();
            this.selectItem = {
                attachments: [],
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
                        reason: ''
                    }
                ],
                proposer: this.cookie_uname,
                applyDept: this.cookie_oname,
                proposerId: '',
                applyDeptId: '',
                applyDate: moment(new Date()).format('YYYY-MM-DD'),
                remark: '',
                opinion: ''
            };
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/asset_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    node: '提交',
                    action: 'COMMIT'
                })
                .then(res => {});
        },
    },
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
            } else {
                this.getForm();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
#AssetForm {
    .uploadBtn {
        margin-right: 10px;
        width: 100px;
        height: 120px;
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