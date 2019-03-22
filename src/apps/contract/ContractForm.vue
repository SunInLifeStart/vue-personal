<template>
    <div id="ContractForm">
        <div class="hehe" style="margin-bottom:10px">
            <h2>注意</h2>
            <ol>
                <li>合同提交审批前请与相关部门充分沟通，达成一致意见。</li>
                <li>注意上传合同应为各方沟通确认的最终版本。</li>
                <li>合同签署完毕后应尽快将纸质合同归档至风险管理部。</li>
            </ol>
        </div>
        <el-form ref="ruleForm" :model="selectItem" label-width="125px" :rules="rules">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="合同类型" prop="contractType">
                        <el-select v-model="selectItem.contractType" @change="getContractNum()" disabled>
                            <el-option v-for="item in contractTypes" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同编号" prop="contractNum">
                        <el-input v-model="selectItem.contractNum" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同名称" prop="contractName">
                        <el-input v-model="selectItem.contractName"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="甲方" prop="partyA">
                        <el-input v-model="selectItem.partyA"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="乙方" prop="partyB">
                        <el-input v-model="selectItem.partyB"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="其他方" prop="otherParty">
                        <el-input v-model="selectItem.otherParty"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同金额" prop="contractAmount">
                        <el-input v-model="selectItem.contractAmount" v-if="selectItem.type=='2'"></el-input>
                        <el-input v-model.number="selectItem.contractAmount" type='number' @mousewheel.native.prevent v-else>
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" style="margin-left:20px; margin-top:8px">
                    <el-radio v-model="selectItem.type" :label="1">有金额</el-radio>
                    <el-radio v-model="selectItem.type" :label="2">无金额</el-radio>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <el-form-item class="hetong" label="合同期限" prop="created" style=" width: 50%; float: left;">
                        <el-input v-model="selectItem.effectiveStart" style="margin-right: 5px;"></el-input>
                        <!-- <el-input style="width: 305px;" prop="created1" v-model="selectItem.effectiveEnd"></el-input> -->
                    </el-form-item>
                    <span style="float: left;line-height: 40px; margin: 0 8px 0 6px;">至</span>
                    <el-form-item label="" prop="created1" label-width="0" style=" width: 40%; float: left;">
                        <!-- <el-input v-model="selectItem.effectiveStart" style="width: 305px;margin-right: 5px;" prop="created"></el-input>至 -->
                        <el-input v-model="selectItem.effectiveEnd"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否历史合同">
                        <el-select v-model="selectItem.historyContract" placeholder="请选择">
                            <el-option label="是" value="是"></el-option>
                            <el-option label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="历史合同已付金额">
                        <el-input v-model="selectItem.historyContractAmount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="经办人">
                        <el-input v-model="selectItem.manager" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="合同谈判情况" prop="contractNegotiation">
                        <!-- <el-input v-model="selectItem.contractNegotiation"></el-input> -->
                        <el-input type="textarea" :autosize="{minRows: 2}" v-model="selectItem.contractNegotiation"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="合同内容摘要" prop="contentAbstract">
                        <!-- <el-input v-model="selectItem.contentAbstract"></el-input> -->
                        <el-input type="textarea" :autosize="{minRows: 2}" v-model="selectItem.contentAbstract"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="正文">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" @click.native="attType = 'attType0'" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in selectItem.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType0'">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" @click.native="attType = 'attType1'" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in selectItem.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType1'">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="附审资料">
                        <table style="width: 100%;  word-break: break-all;">
                            <col style="width: 100%" />
                            <!-- <col style="width: 84%"  table-layout: fixed;/> -->
                            <tr>
                                <!-- <td rowspan="2">附审资料</td> -->
                                <td>
                                    <el-form-item label="合同所涉经济行为批准文件" label-width="220px">
                                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" @click.native="attType = 'attType2'" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <div v-for="item in selectItem.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType2'">
                                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                                        </div>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-form-item label="合同相对方资质证照复印件" label-width="220px">
                                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" @click.native="attType = 'attType3'" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <div v-for="item in selectItem.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType3'">
                                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                                        </div>
                                    </el-form-item>
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24" style="text-align: right;">
                    <el-form-item>
                        谈判小组成员
                        <el-select v-model="value" filterable placeholder="请选择">
                            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
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
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
export default {
    name: 'ContractForm',
    data() {
        return {
            attType: '',
            info: '',
            selectItem: {
                creatorId: cookies.get('uid'),
                creatorName: cookies.get('uname'),
                organId: cookies.get('oid'),
                organName: cookies.get('oname'),
                contractNum: '',
                historyContract: '',
                effectiveStart: '',
                effectiveEnd: '',
                attachments: [],
                type: 1
            },
            contractNum1: '',
            created: [],
            tabledata: [],
            contractTypes: [
                {
                    id: '投',
                    name: '投资类'
                },
                {
                    id: '采',
                    name: '采购类'
                },
                {
                    id: '售',
                    name: '销售类'
                },
                {
                    id: '服',
                    name: '服务咨询类'
                },
                {
                    id: '金',
                    name: '金融类'
                },
                {
                    id: '建',
                    name: '建设类'
                },
                {
                    id: '物',
                    name: '物业类'
                },
                {
                    id: '合',
                    name: '其他类'
                },
                {
                    id: '人',
                    name: '人力资源类'
                },
                {
                    id: '密',
                    name: '保密类'
                }
            ],
            currentFormId: this.operationType == 'create' ? '' : this.formId,
            options: [],
            value: '',
            rules: {
                contractName: [
                    {
                        required: true,
                        message: '请输入合同名称',
                        trigger: 'blur'
                    }
                ],
                partyA: [
                    {
                        required: true,
                        message: '请输入甲方信息',
                        trigger: 'blur'
                    }
                ],
                partyB: [
                    {
                        required: true,
                        message: '请输入乙方信息',
                        trigger: 'blur'
                    }
                ],

                contractAmount: [
                    {
                        required: true,
                        message: '请输入合同金额',
                        trigger: 'blur'
                    }
                ],
                contractNegotiation: [
                    {
                        required: true,
                        message: '请输入谈判情况',
                        trigger: 'blur'
                    }
                ],
                // created: [
                //     {
                //         required: true,
                //         message: '请输入合同开始日期',
                //         trigger: 'blur'
                //     }
                // ],
                // created1: [
                //     {
                //         required: true,
                //         message: '请输入合同结束日期',
                //         trigger: 'blur'
                //     }
                // ],
                contentAbstract: [
                    {
                        required: true,
                        message: '请输入合同摘要',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    components: {
        FilesOperate
    },
    props: ['formId', 'operationType'],
    mounted() {
        const self = this;
        if (this.operationType == 'edit') {
            this.getForm();
        }
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function (item) {
            if (item.indexOf('uname') > 0) {
                self.selectItem.manager = decodeURIComponent(
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
        this.getUser();
    },
    watch: {
        formId: function () {
            this.getForm();
        },
        operationType: function () {
            if (this.operationType == 'create') {
                this.clearForm();
            }
            if (this.operationType == 'edit') {
                this.getForm();
            }
        }
    },
    methods: {
        clearForm() {
            this.selectItem = {
                manager: cookies.get('uname'),
                creatorId: cookies.get('uid'),
                creatorName: cookies.get('uname'),
                organId: cookies.get('oid'),
                organName: cookies.get('oname'),
                contractNum: '',
                historyContract: '',
                effectiveStart: '',
                effectiveEnd: '',
                attachments: [],
                type: 1
            };
            this.created = [''];
            this.value = '';
            this.currentFormId = '';
        },
        getUser() {
            const self = this;
            axios
                .get('/api/v1/users')
                .then(res => {
                    self.options = res.data;
                })
                .catch(function () {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },

        getContractNum() {
            const self = this;
            const year = moment()
                .utc()
                .format('YYYY');
            const type = self.selectItem.contractType;
            const dept = this.getDept(this.cookie_oname);
            axios
                .get(
                    '/api/v1/contract_forms/contractNum/year/' + year + '?type=' + type + '&dept=' + dept
                )
                .then(res => {
                    self.contractNum1 = res.data;
                    self.selectItem.contractNum = self.contractNum1;
                })
                .catch(function () {
                    self.$message({
                        message: '合同编号获取失败',
                        type: 'error'
                    });
                });
        },
        getDept(oname) {
            switch (oname) {
                case '区域合作部':
                    return (oname = 'QY');
                    break;
                case '集团办公室':
                    return (oname = 'B');
                    break;
                case '宣传部':
                    return (oname = 'X');
                    break;
                case '资金财务部':
                    return (oname = 'C');
                    break;
                case '风险管理部':
                    return (oname = 'F');
                    break;
                case '产业投资部':
                    return (oname = 'T');
                    break;
                case '科技园区事业部':
                    return (oname = 'Y');
                    break;
                case '科技金融事业部':
                    return (oname = 'JR');
                    break;
                case '资本运营部':
                    return (oname = 'J');
                    break;
                case '战略管理部':
                    return (oname = 'G');
                    break;
                case '纪检监察部':
                    return (oname = 'JC');
                    break;
                case '海外业务部':
                    return (oname = 'H');
                    break;
                case '人力资源部':
                    return (oname = 'R');
                    break;
                case '党群工作部':
                    return (oname = 'Q');
                    break;
                case '董事会办公室':
                    return (oname = 'D');
                    break;
                default:
                    return (oname = 'QT');
            }
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/contract_forms/' + this.formId)
                    .then(res => {
                        self.selectItem = res.data;
                        self.value = self.selectItem.tpxzName;
                        // console.log(res.data)
                        // self.created = [];
                        // self.created.push(self.selectItem. effectiveStart);
                        // self.created.push(self.selectItem.effectiveEnd);
                    })
                    .catch(function () {
                        self.$message({
                            message: '详细信息查询失败',
                            type: 'error'
                        });
                    });
            }
        },
        saveForm1(action) {
            // if (this.selectItem.type == '2') {
            //     this.selectItem.contractAmount = '0';
            // }
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.saveForm(action);
                } else {
                    this.$message({
                        message: '必输项不能为空',
                        type: 'warning'
                    });
                }
            });
        },
        saveForm(action) {
            const self = this;
            for (let item of this.options) {
                if (this.value == item.id) {
                    this.selectItem.tpxzName = item.name;
                }
            }
            axios
                .post('/api/v1/contract_forms/save', this.selectItem)
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
                .catch(function () {
                    self.$message({
                        message: '保存操作失败',
                        type: 'error'
                    });
                });
        },
        terminalForm() {
            const self = this;
            axios
                .put('/api/v1/contracts/' + this.formId + '/terminal', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => { })
                .catch(function () {
                    self.$message({
                        message: '终结操作失败',
                        type: 'error'
                    });
                });
        },
        submitCheck() {
            this.saveForm1('save');
        },
        submitForm() {
            const self = this;
            if (this.value != '') {
                axios
                    .post(
                        '/api/v1/contracts/' + this.currentFormId + '/create',
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
                    .catch(function () {
                        self.$message({
                            message: '提交操作失败',
                            type: 'error'
                        });
                    });
            } else {
                alert('请选择谈判小组成员');
            }
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/contract_forms/' +
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
                .catch(function () {
                    self.$message({
                        message: '提交操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT',
                assignees: [self.value]
            };
            axios
                .put(
                    '/api/v1/contracts/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.comment();
                    self.$emit('refreshData');
                    this.info = 'saveRuleSucceed';
                    this.$emit('info', this.info);
                    self.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                })
                .catch(function () {
                    self.$message({
                        message: 'startProcess操作失败',
                        type: 'error'
                    });
                });
        },
        handleSuccess(response, file) {
            for (let item of response) {
                console.log(item);
                this.selectItem.attachments.push({
                    iconUrl: item.iconUrl,
                    id: item.id,
                    name: item.name,
                    organId: item.organId,
                    organName: item.organName,
                    size: item.size,
                    type: item.type,
                    uid: item.uid,
                    uname: item.uname,
                    url: item.url,
                    attType: this.attType
                });
            }
        },
        downloadFile(item) {
            //window.open(url, '_blank');
            this.common.preview(item);
        },
        handlePreview() { },
        handleRemove() { },
        submitUpload() {
            this.$refs.upload.submit();
        },
        deleteItem(index) {
            this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                this.tableData.splice(index, 1);
            });
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/contract_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    action: 'COMMIT',
                    node: '提交'
                })
                .then(res => { });
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
                                '/api/v1/contract_forms/deleteAttachment/' + id,
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.selectItem.attachments.forEach(function (
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
                            .catch(function () {
                                self.$message({
                                    message: '操作失败',
                                    type: 'error'
                                });
                            });
                    }
                );
            }
        }
    }
};
</script>
<style lang="scss">
#ContractForm {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
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

  .attachments {
    position: relative;
    margin-bottom: 40px;
    margin-right: 10px;
    width: 100px;
    height: 120px;
    text-align: center;
    display: inline-block;
    border: 1px solid #c0c4cc;

    border-radius: 2px;
    cursor: pointer;
    img {
      width: 100px;
      height: 120px;
    }

    p {
      margin: 0;
      line-height: 20px;
      color: #606266;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    i {
      position: absolute;
      top: 0;
      right: 0;
      padding: 5px;
      &:hover {
        color: red;
      }
    }
  }
  .hehe {
    color: red;
    padding-left: 65px;
    li {
      font-size: 17px;
    }
  }
  table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
    width: 100%;
  }
  table td,
  table th {
    border: 1px solid #dcdfe6;
    color: #000;
    height: 40px;
    vertical-align: middle;
  }
  table thead th {
    background-color: #cce8eb;
  }
  table tr:nth-child(odd) {
    background: #fff;
  }
  table tr:nth-child(even) {
    background: #fff;
  }
  .el-form-item .el-form-item .el-form-item__label {
    line-height: 120px;
  }
}
</style>