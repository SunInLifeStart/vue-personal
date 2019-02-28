<template>
    <div id="ForeignPlanForm">
        <el-form :model="selectItem" label-width="130px">
            <el-row>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="selectItem.title"></el-input>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="申请人" prop="creatorName">
                        <el-input v-model="selectItem.creatorName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="集团部门/子公司名称" prop="organName" label-width="180px">
                        <el-select style="width:100%;" v-model="selectItem.organName" placeholder="请选择" disabled>
                            <el-option v-for="item in combinedUnit" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="申请日期" prop="created">
                        <el-date-picker v-model="selectItem.created" type="datetime" style="width:100%"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="申请明细">
                <div style="float: right;">
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem()" style="margin-right: 5px;"></el-button>
                    <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem()"></el-button>
                </div>
                <el-table :data="selectItem.items" style="width: 100%; margin-top: 5px;" @selection-change="handleSelectionChange" @row-dblclick="editItem">
                    <el-table-column type="selection" fixed="left"></el-table-column>
                    <el-table-column prop="manager" label="负责人" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="personNum" label="人数" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="time" label="出国时间" min-width="160px">
                        <template slot-scope="scope">
                            {{scope.row.time | dateformat('YYYY-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="stopTime" label="停留时间" min-width="120px">
                        <template slot-scope="scope">
                            {{scope.row.stopTime | dateformat('YYYY-MM-DD')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="destination" label="目的地" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="passWay" label="途径地点" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="task" label="任务" min-width="120px">
                    </el-table-column>
                    <el-table-column prop="taskSource" label="任务来源或依据" min-width="200px">
                    </el-table-column>
                    <el-table-column prop="budget" label="费用预算及来源" min-width="200px">
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <div>
            <el-dialog title="申请明细" append-to-body :visible.sync="innerVisible" max-width="880px" width="70%">
                <el-form :model="itemInfo" label-width="130px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="负责人" prop="manager">
                                <el-input v-model="itemInfo.manager"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="人数" prop="personNum">
                                <el-input v-model="itemInfo.personNum">
                                    <template slot="append">人</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出国时间" prop="time">
                                <el-date-picker style="width: 100%" v-model="itemInfo.time" type="date" format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                        <el-col :span="8">
                            <el-form-item label="停留时间" prop="stopTime">
                                <el-date-picker style="width: 100%" v-model="itemInfo.stopTime" type="date" format="yyyy-MM-dd"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="目的地" prop="destination">
                                <el-input v-model="itemInfo.destination"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="途径地点" prop="passWay">
                                <el-input v-model="itemInfo.passWay"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="任务" prop="task">
                                <el-input type="textarea" :autosize="{minRows: 1}" v-model="itemInfo.task">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="任务来源或依据" prop="taskSource">
                                <el-input type="textarea" :autosize="{minRows: 4}" v-model="itemInfo.taskSource">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="费用预算及来源" prop="budget">
                                <el-input type="textarea" :autosize="{minRows: 4}" v-model="itemInfo.budget">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="saveItem()">保存</el-button>
                    <el-button type="default" @click="innerVisible = false">取消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'ForeignPlanForm',
    data() {
        return {
            ids: 0,
            selectionItems: [],
            innerVisible: false,
            tabledata: [],
            selectItem: {
                items: [],
                creatorName: this.cookie_uname,
                organName: this.cookie_oname,
                created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            },
            itemInfo: {
                time: '',
                stopTime: ''
            },
            cookie_oname: '',
            cookie_uname: '',
            combinedUnit: [
                '党委办公室集团办公室',
                '董事会办公室',
                '党群工作部',
                '资本运营部',
                '风险管理部',
                '科技金融事业部/中科金',
                '组织部人力资源部',
                '宣传部品牌管理部',
                '纪检监察部',
                '战略管理部',
                '资金财务部',
                '科技园区事业部',
                '产业投资部',
                '海外业务部',
                '区域合作部'
            ],
            formLabelWidth: '120px',
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            rules: {
                manager: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ]
            }
        };
    },
    props: ['formId', 'operationType'],
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.cleanForm();
            } else {
                this.getForm();
            }
        }
    },
    mounted() {
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > -1) {
                self.selectItem.creatorName = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.selectItem.organName = decodeURIComponent(
                    item.split('=')[1]
                );
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
    methods: {
        addItem() {
            this.innerVisible = true;
            this.itemInfo = {
                time: '',
                stopTime: ''
            };
        },
        saveItem() {
            if (this.itemInfo.time) {
                this.itemInfo.time = moment(this.itemInfo.time).format(
                    'YYYY-MM-DD HH:mm:ss'
                    // 'YYYY-MM-DD'
                );
            }
            if (this.itemInfo.stopTime) {
                this.itemInfo.stopTime = moment(this.itemInfo.stopTime).format(
                    'YYYY-MM-DD HH:mm:ss'
                    // 'YYYY-MM-DD'
                );
            }
            if (this.itemInfo.count == null && this.itemInfo.id == null) {
                this.itemInfo.count = ++this.ids;
                this.selectItem.items.push(this.itemInfo);
            } else {
            }
            this.innerVisible = false;
        },
        editItem(row, column) {
            this.innerVisible = true;
            this.itemInfo = row;
        },
        deleteItem() {
            const self = this;
            if (self.selectionItems.length > 0) {
                self
                    .$confirm('是否删除?', '提示', { type: 'warning' })
                    .then(() => {
                        self.selectionItems.forEach(function(oData) {
                            if (oData.count) {
                                self.selectItem.items.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.count == oData.count) {
                                        self.selectItem.items.splice(index, 1);
                                    }
                                });
                            } else {
                                axios
                                    .delete(
                                        '/api/v1/foreign_forms/plan/deleteItem/?id=' +
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
                                        self.selectItem.items.forEach(function(
                                            item,
                                            index
                                        ) {
                                            if (item.id == oData.id) {
                                                self.selectItem.items.splice(
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
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/foreign_forms/plan/' + this.formId)
                    .then(res => {
                        self.selectItem = res.data;
                        if (self.selectItem.created) {
                            self.selectItem.created = moment(
                                self.selectItem.created
                            ).format('YYYY-MM-DD HH:mm:ss');
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        saveFormValidate() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    this.saveForm();
                    this.$emit('saveStatus', false);
                }
            });
        },
        saveForm(action = '') {
            const self = this;
            if (self.selectItem.created) {
                self.selectItem.created = moment(
                    self.selectItem.created
                ).format('YYYY-MM-DD HH:mm:ss');
            } else {
                self.selectItem.created = moment(new Date()).format(
                    'YYYY-MM-DD HH:mm:ss'
                );
            }
            axios
                .post(
                    '/api/v1/foreign_forms/plan/save',
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
        },
        submitCheck() {
            this.$refs['formupdate'].validate(valid => {
                if (valid) {
                    if (this.operationType == 'create') {
                        this.saveForm('save');
                        this.$emit('saveStatus', false);
                    } else {
                        this.submitForm();
                        this.$emit('saveStatus', false);
                    }
                }
            });
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/foreigns/' + this.currentFormId + '/create',
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
                    '/api/v1/foreign_forms/' +
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
        cleanForm() {
            this.selectItem = {
                items: [],
                creatorName: this.cookie_uname,
                organName: this.cookie_oname,
                created: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            };
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT'
            };
            axios
                .put(
                    '/api/v1/foreigns/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped>
</style>