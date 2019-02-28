
<template>
    <div id="DriverForm">
        <el-form ref="form" :model="selectItem" label-width="100px" :rules="rules">
            <el-row>
                <el-col :span='12'>
                    <el-form-item label="姓名" prop="name">
                        <el-select v-model="selectItem.name" @change="changeUser" filterable placeholder="请选择用户">
                            <el-option v-for="item in users" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号 " prop="phone">
                        <el-input v-model="selectItem.phone"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="邮箱 " prop="mailbox">
                        <el-input v-model="selectItem.mailbox"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="性别 " prop="sex">
                        <el-select v-model="selectItem.sex" placeholder="选择性别" style="width:100%">
                            <el-option key="1" label="男" value="男"></el-option>
                            <el-option key="2" label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="出生日期 " prop="birthday">
                        <el-date-picker type="date" placeholder="YYYY-MM-DD" value-format="yyyy-MM-dd" v-model="selectItem.birthday" style="width:100%"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="司机住址 " prop="address">
                        <el-input v-model="selectItem.address"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="执照号码 " prop="licenseNum">
                        <el-input v-model="selectItem.licenseNum"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="准驾车型 " prop="permitType">
                        <el-input v-model="selectItem.permitType"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="初次领证 " prop="firstLicenseTime">
                        <el-date-picker type="date" placeholder="YYYY-MM-DD" value-format="yyyy-MM-dd" v-model="selectItem.firstLicenseTime" style="width:100%"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="司机状态 " prop="status">
                        <el-select v-model='selectItem.status' placeholder="请选择" prop="status" style="width:100%">
                            <el-option v-for="item in status_options" :key="item.value_status" :label="item.label_status" :value="item.value_status">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span='24'>
                    <el-form-item label="备注 " prop="remarks">
                        <el-input type="textarea" :autosize="{minRows:5, maxRows: 5}" v-model="selectItem.remarks">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'DriverForm',
    data() {
        return {
            users: [],
            driver:{},
            timeout: null,
            childValue: '',
            selectItem: {
                id: '',
                name: '',
                phone: '',
                qq: '',
                mailbox: '',
                sex: '',
                birthday: '',
                address: '',
                licenseNum: '',
                permitType: '',
                firstLicenseTime: '',
                status: '',
                remarks: ''
            },
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            status_options: [
                {
                    value_status: '正常',
                    label_status: '正常'
                },
                {
                    value_status: '请假',
                    label_status: '请假'
                }
            ],
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入司机姓名',
                        trigger: 'change'
                    },
                ],
                phone: [
                    // {
                    //     type: 'number',
                    //     required: true,
                    //     message: '请输入数字',
                    //     trigger: 'change'
                    // },
                    {
                        min: 11,
                        max: 11,
                        required: true,
                        message: '请输入11位手机号码',
                        trigger: 'change'
                    }
                ],
                sex: [
                    {
                        required: true,
                        message: '请选择性别',
                        trigger: 'blur'
                    }
                ],
                birthday: [
                    {
                        required: true,
                        message: '请选择时间',
                        trigger: 'blur'
                    }
                ]
            }
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
        this.remoteMethod();
    },
    watch: {
        formId: function() {
            this.getForm();
        },
        operationType: function() {
            if (this.operationType == 'create') {
                this.clearForm();
            }
        }
    },
    methods: {
        changeUser(){
           for(let usr of this.users){
               if(usr.id == this.selectItem.id){
                   this.selectItem.name = usr.name;
               }
           }
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/vehicle_forms/driver/' + this.formId)
                    .then(res => {
                        self.selectItem = res.data;
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
                .post(
                    '/api/v1/vehicle_forms/driver/save',
                    JSON.stringify(this.selectItem),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.currentFormId = res.data.id;
                    self.$emit('refreshData');
                    if (action == 'save') {
                        self.submitForm();
                    }else{
                         self.$emit('refreshData');
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
            if (this.operationType == 'create') {
                this.saveForm('save');
            } else {
                this.submitForm();
            }
        },
        saveForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.saveForm1();
                    this.childValue = '成功';
                    this.$emit('childByValue', this.childValue);
                } else {
                    return false;
                }
            });
        },
        remoteMethod() {
            axios.get('/api/v1/users/role/driver').then(res => {
                this.users = res.data;
            });
        },
        clearForm() {
            this.selectItem = {
                name: '',
                phone: '',
                qq: '',
                mailbox: '',
                sex: '',
                birthday: '',
                address: '',
                licenseNum: '',
                permitType: '',
                firstLicenseTime: '',
                status: '',
                remarks: '',
                organName: this.cookie_oname,
                creatorName: this.cookie_uname,
              
            };
        },
        propid(){
            this.selectItem.id = item.id
        }
    }
};
</script>
<style lang="scss" scoped>
#DriverForm {
    .uploadBtn {
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

    .attachments {
        margin-left: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;

        border-radius: 2px;
        cursor: pointer;
        img {
            width: 100px;
            height: 120px;
        }

        p {
            margin: 0;
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>