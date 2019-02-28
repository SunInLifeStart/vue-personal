<template>
    <div id="ApplyForm">
        <el-form ref="ApplyForm" :model="rows" label-width="100px" :rules="rules">
            <el-row :gutter="30">
                <el-col :span="12">
                    <el-form-item label="用车人" prop="transportPpl">
                        <!-- <el-select v-model="rows.transportPpl" @change="changeUser" filterable placeholder="请选择用户">
                            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select> -->
                        <el-select v-model="rows.bname1" value-key="id" @change="changeUser" filterable placeholder="请选择用车人">
                            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="车辆类型" prop="vehicleType">
                        <el-select v-model="rows.vehicleType" placeholder="请选择">
                            <el-option label="大型客车" value="大型客车"></el-option>
                            <el-option label="小型客车" value="小型客车"></el-option>
                            <el-option label="小型自动挡汽车" value="小型自动挡汽车"></el-option>
                            <el-option label="其它" value="其它"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="申请人">
                        <el-input v-model="rows.creatorName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用车部门" prop="transportDept">
                        <el-input v-model="rows.transportDept" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用车人电话" prop="transportPplPhone">
                        <el-input v-model="rows.transportPplPhone"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="乘车人数" prop="transportNum">
                        <el-input v-model="rows.transportNum"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出发地" prop="origin">
                        <el-input v-model="rows.origin"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="目的地" prop="destination">
                        <el-input v-model="rows.destination"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开始时间" prop="startTime">
                        <!-- <el-input v-model="rows.startTime"></el-input> -->
                        <el-date-picker v-model="rows.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="预计结束时间" prop="endTime" label-width="120px">
                        <!-- <el-input v-model="rows.endTime"></el-input> -->
                        <el-date-picker v-model="rows.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="事由">
                        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" v-model="rows.reason"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-dialog title="用车人" :visible.sync="innerDialogYcr" width="50%" append-to-body>
            <el-row>
                <el-col :span="24">
                    <el-form :inline="true" :model="innerrcrfrom" class="demo-form-inline">
                        <el-form-item label="定位：" prop="dw">
                            <el-input v-model="innerrcrfrom.dw" suffix-icon="el-icon-search" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-table :data="tableData" border height="250" style="width: 100%;">
                        <el-table-column prop="number" label="分类" sortable>
                            <template slot-scope="scope">
                                <div @click="selectClass(scope.$index)">{{scope.row.number}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="15">
                    <el-table :data="tableData1" border height="250" style="width: 100%;">
                        <el-table-column prop="name" label="人员编码" sortable></el-table-column>
                        <el-table-column prop="address" label="姓名" sortable></el-table-column>
                        <el-table-column fixed="right" label="选择信息" width="80px" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="selectdialogycr(scope.row)">+</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import cookies from 'js-cookie';
export default {
    name: 'ApplyForm',
    data() {
        return {
            rules: {
                transportPpl: [
                    {
                        required: true,
                        message: '请选择用车人',
                        trigger: 'blur'
                    }
                ],
                // transportDept: [
                //     {
                //         required: true,
                //         message: '请输入用车人部门',
                //         trigger: 'blur'
                //     }
                // ],
                transportPplPhone: [
                    {
                        required: true,
                        message: '请输入用车人电话',
                        trigger: 'blur'
                    }
                ],
                vehicleType: [
                    {
                        required: true,
                        message: '请选择车辆类型',
                        trigger: 'blur'
                    }
                ],
                transportNum: [
                    {
                        required: true,
                        message: '请输入乘车人数',
                        trigger: 'blur'
                    }
                ],
                origin: [
                    {
                        required: true,
                        message: '请输入出发地',
                        trigger: 'blur'
                    }
                ],
                destination: [
                    {
                        required: true,
                        message: '请输入目的地',
                        trigger: 'blur'
                    }
                ],
                startTime: [
                    {
                        required: true,
                        message: '请选择开始时间',
                        trigger: 'blur'
                    }
                ],
                endTime: [
                    {
                        required: true,
                        message: '请选择预计结束时间',
                        trigger: 'blur'
                    }
                ]
            },
            options_type: [
                {
                    value_type: '大型客车',
                    label_xwfx: '大型客车'
                },
                {
                    value_type: '小型客车',
                    label_xwfx: '小型客车'
                },
                {
                    value_type: '小型自动挡汽车',
                    label_xwfx: '小型自动挡汽车'
                },
                {
                    value_type: '其它',
                    label_xwfx: '其它'
                }
            ],
            pickerOptions1: {
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    },
                    {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }
                ]
            },
            dialogTableVisible: false,
            dialogFormVisible: false,
            users: [],
            rows: {
                transportPpl: '',
                bname1: {},
                creatorName: '',
                transportDept: cookies.get('oname'),
                transportPplPhone: '',
                vehicleType: '',
                transportNum: '',
                origin: '',
                destination: '',
                attachments: []
            },
            formLabelWidth: '120px',
            dispatchDialog: false,
            innerDialogYcr: false,
            innerDialogCllx: false,
            dispatch: ['selectVehicle', 'selectDriver'],
            tableData: [],
            tableData1: [],
            examinefrom: {
                dxtzry: []
            },
            activeName: 'ycgl',
            innerrcrfrom: {},
            innerrclxfrom: {},
            selectionItems: [],
            params: {
                pageNum: 1,
                pageSize: 5,
                total: 0
            },
            vehicle_form: {},
            vehicletable: [],
            options: [],

            currentFormId: this.operationType == 'create' ? '' : this.formId
        };
    },
    props: ['formId', 'operationType'],
    mounted() {
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.rows.creatorName = decodeURIComponent(item.split('=')[1]);
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.rows.organName = decodeURIComponent(item.split('=')[1]);
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
    watch: {
        formId: function() {
            if (this.operationType == 'edit') {
                this.getForm();
            } else {
                this.clearForm();
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
        const self = this;
        this.remoteMethod();
        if (this.operationType == 'edit') {
            this.getForm();
        }
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.rows.creatorName = decodeURIComponent(item.split('=')[1]);
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.rows.organName = decodeURIComponent(item.split('=')[1]);
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
    },

    methods: {
        changeUser() {
            for (let data of this.users) {
                if (this.rows.bname1.id == data.id) {
                    if (data.organ) {
                        this.rows.transportDept = data.organ.name;
                        this.rows.transportPpl = this.rows.bname1.name;
                    } else {
                        this.rows.transportDept = '';
                    }
                }
            }
        },
        remoteMethod() {
            axios.get('/api/v1/users').then(res => {
                this.users = res.data;
            });
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/vehicle_forms/' + this.formId)
                    .then(res => {
                        self.rows = res.data;
                        self.rows.bname1 = self.rows.transportPpl;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            }
        },
        saveForm1(action = '') {
            const self = this;
            axios
                .post('/api/v1/vehicle_forms/save', JSON.stringify(this.rows), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.currentFormId = res.data.id;
                    if (action == 'save') {
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
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/vehicle_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    node:'提交',
                    action: 'COMMIT',
                })
                .then(res => {});
        },
        saveForm(type) {
            // this.saveForm1(type);
            /** 
            this.childValue = '成功';
            this.$emit('childByValue', this.childValue);
            */
            this.$refs['ApplyForm'].validate(valid => {
                if (valid) {
                    this.saveForm1(type);
                    this.$emit('saveStatuss', false);
                }
            });
        },
        submitCheck() {
            this.saveForm('save');
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/vehicles/' + this.currentFormId + '/create',
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
            // /api/v1/vehicle_forms/{formId}/commit/{processId}
            axios
                .put(
                    '/api/v1/vehicle_forms/' +
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
                    '/api/v1/vehicles/' + this.currentFormId + '/signal',
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
                    self.comment();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteItem(index) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.tableData.splice(index, 1);
            });
        },
        addItems() {
            this.isshow = false;
            this.type = 'add';
            this.vehicle_form.ycr = '';
            this.vehicle_form.yczz = '';
            this.vehicle_form.ycbm = '';
            this.vehicle_form.ycrdh = '';
            this.vehicle_form.cllx = '';
            this.vehicle_form.cllx = '';
            this.vehicle_form.ccrs = '';
            this.vehicle_form.mdd = '';
            this.vehicle_form.sy = '';
        },
        handleClick() {},
        clickTableRow(row) {
            this.vehicle_form = row;
        },
        //点击输入框，dialog
        openYcrDialog() {
            this.innerDialogYcr = true;
        },
        openCllxDialog() {
            this.innerDialogCllx = true;
        },
        selectdialogcllx(row) {
            this.examinefrom.cllx = row.dabh;
            this.innerDialogCllx = false;
        },
        selectdialogycr(row) {
            this.examinefrom.ycr = row.address;
            this.innerDialogYcr = false;
        },
        /*selectdialogclxx(row) {
            this.examinefrom.cph = row.cars_number;
            this.examinefrom.cx = row.cars_type;
            this.examinefrom.hzrs = row.cars_person_number;
            this.examinefrom.clys = row.cars_color;
            this.$message({
                type: 'success',
                message: '车辆信息选择成功！'
            });
        },*/
        /*selectdialogsj(row) {
            this.examinefrom.sj = row.cars_status;
            this.examinefrom.lxdh = row.cars_buydate;
            this.$message({
                type: 'success',
                message: '司机信息选择成功！'
            });
        },*/
        // 选择分类
        selectClass(index) {
            this.tableData1 = this.options[index].children;
        },
        handleSelectionChange(selection) {
            this.selectionItems = selection;
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getTables();
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getTables();
        },
        searchtitle() {
            this.getTables();
        },
        //删除方法
        deleteItem(index) {
            this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.vehicletable.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除操作！'
                    });
                });
        },
        handleChange() {},
        openPage(type, row) {
            this.$router.push({
                path: '/vue/oa/vehicle-application-sub',
                query: {
                    pageType: type,
                    row: row ? row : ''
                }
            });
        },
        clearForm() {
            this.rows = {
                transportPpl: '',
                transportDept: '',
                transportPplPhone: '',
                vehicleType: '',
                origin: '',
                destination: '',
                bname1: {},
                organName: this.cookie_oname,
                creatorName: this.cookie_uname,
                attachments: []
            };
        }
    }
};
</script>