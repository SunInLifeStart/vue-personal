<template>
    <div id="ContractDetailt">
        <el-form ref="form" :model="tableData">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="合同名称：">{{tableData.contractName}}</el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="合同类型：" prop="contractType">
                        {{tableData.contractType}}
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="合同编号：" prop="contractNum">
                        {{tableData.contractNum}}
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="经办人：">{{tableData.manager}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="甲方：">{{tableData.partyA}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="乙方：">{{tableData.partyB}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="其他方：">{{tableData.otherParty}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合同金额：">{{tableData.contractAmount}}</el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="合同期限：">{{created}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否历史合同：">{{tableData.historyContract}}</el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="历史合同已付金额：">{{tableData.historyContractAmount}}</el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span="24">
                    <el-form-item label="风险提示或说明：">{{tableData.riskWarning}}</el-form-item>
                </el-col>
            </el-row> -->
            <el-row>
                <el-col :span="24">
                    <el-form-item label="正文：">
                        <div v-for="item in  tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType0'">
                            <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件：">
                        <div v-for="item in  tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType1'">
                            <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附审资料：">
                        <table style="width: 100%; table-layout: fixed; word-break: break-all;">
                            <col style="width: 14%" />
                            <col style="width: 86%" />
                            <tr>
                                <td rowspan="2">附审资料</td>
                                <td>
                                    <el-form-item label="合同所涉经济行为批准文件" label-width="210px">
                                        <div v-for="item in  tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType2'">
                                            <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                                        </div>
                                    </el-form-item>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <el-form-item label="合同相对方资质证照复印件" label-width="210px">
                                        <div v-for="item in  tableData.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType3'">
                                            <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                                        </div>
                                    </el-form-item>
                                </td>
                            </tr>
                        </table>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Comment from '../Comment';
import FilesOperate from '../FilesOperate';
export default {
    name: 'ContractDetailt',
    data() {
        return {
            tableData: {},
            budgetCheck: [],
            auditSituationChecked: '',
            created: '',
            actions: [],
            crumb: { items: [] },
            rejectTarget: '',
            rejectList: [],
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
            cookie_uname: '',
            cookie_oname: '',
            type: '',
            pneumatic: false //风控标识
        };
    },
    props: ['formId'],
    components: {
        Comment,
        FilesOperate
    },
    mounted() {
        const self = this;
        this.getForm();
        if (this.formId != '') {
            this.getActions();
        }
        const cookieItems = document.cookie.split(';');
        cookieItems.forEach(function(item) {
            if (item.indexOf('uname') > 0) {
                self.cookie_uname = decodeURIComponent(item.split('=')[1]);
            }
            if (item.indexOf('oname') > 0) {
                self.cookie_oname = decodeURIComponent(item.split('=')[1]);
            }
        });
    },
    watch: {
        formId: function() {
            this.getForm();
            this.getActions();
        }
    },
    methods: {
        getId(id) {},
        //获得合同编号
        // getContractNum() {
        //     const self = this;
        //     for (let item of this.contractTypes) {
        //         if (item.name == this.tableData.contractType) {
        //             this.type = item.id;
        //         }
        //     }
        //     const year = moment()
        //         .utc()
        //         .format('YYYY');
        //     const dept = this.getDept(self.cookie_oname);
        //     axios
        //         .get(
        //             '/api/v1/contract_forms/contractNum/year/' +
        //                 year +
        //                 '?type=' +
        //                 this.type +
        //                 '&dept=' +
        //                 dept
        //         )
        //         .then(res => {
        //             self.contractNum1 = res.data;
        //             self.tableData.contractNum = self.contractNum1;
        //             this.saveForm();
        //         })
        //         .catch(function() {
        //             self.$message({
        //                 message: '合同编号获取失败',
        //                 type: 'error'
        //             });
        //         });
        // },
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
        saveForm() {
            if (this.tableData.contractType && this.tableData.contractNum) {
                const self = this;
                axios
                    .post('/api/v1/contract_forms/save', this.tableData)
                    .then(res => {})
                    .catch(function() {
                        self.$message({
                            message: '保存失败',
                            type: 'error'
                        });
                    });
            }
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/contract_forms/' + this.formId)
                    .then(res => {
                        self.tableData = res.data;
                        if (self.tableData.effectiveEnd) {
                            self.tableData.effectiveStart =
                                self.tableData.effectiveStart;
                            self.tableData.effectiveEnd =
                                self.tableData.effectiveEnd;
                            self.created =
                                self.tableData.effectiveStart +
                                ' 至 ' +
                                self.tableData.effectiveEnd;
                        } else {
                            self.created = '';
                        }
                    })
                    .catch(function() {
                        self.$message({
                            message: '查看详情失败',
                            type: 'error'
                        });
                    });
            }
        },
        downloadFile(url) {
            window.open(url, '_blank');
        },
        getActions() {
            // axios.get(`/api/v1/contracts/${this.formId}/actions`).then(res => {
            //     this.actions = res.data.types;
            // });
            // axios.get(`/api/v1/contracts/${this.formId}/crumb`).then(res => {
            //     for (let item of res.data) {
            //         if (item.name == '风控' && item.active == true) {
            //             this.pneumatic = true;
            //         }
            //     }
            //     this.crumb = { items: res.data, index: -1 };
            //     res.data.forEach((item, index) => {
            //         if (item.active) {
            //             this.crumb.index = index;
            //         }
            //     });
            // });
            // this.getRejectList();
        },
        doComment(action) {
            let atIds = this.$refs.comment.getIds();
            let comment = this.$refs.comment.getComment();
            if (this.$refs.comment.isEmpty()) {
                comment = action.name;
            }
            if (action.type == 'REJECT') {
                if (this.rejectTarget == '') {
                    this.$message({
                        message: '请选择驳回节点',
                        type: 'error'
                    });
                    return false;
                }
            }

            axios
                .put(`/api/v1/contract_forms/${this.formId}/comment`, {
                    content: comment
                })
                .then(res => {
                    comment = '';
                    this.$refs.comment.clearComment();
                    this.getForm();

                    if (!'SAVE,PREVIEW,COMMENT'.includes(action.type)) {
                        axios
                            .put(`/api/v1/contracts/${this.formId}/signal`, {
                                action: action.type,
                                assignees: atIds,
                                rejectTarget: this.rejectTarget
                            })
                            .then(res => {
                                this.getActions();
                            });
                    }
                });
        },
        getRejectList() {
            const self = this;
            axios
                .get('/api/v1/contracts/' + this.formId + '/reject/targets')
                .then(res => {
                    self.rejectList = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败1',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss" scope>
#ContractDetail {
    .attachments {
        margin-left: 10px;
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
            line-height: 15px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .audit {
        position: relative;
        margin-bottom: 10px;
        font-size: 14px;
        box-shadow: none;
        border: 0;
        .avatar {
            position: absolute;
            left: 5px;
            top: 5px;
            width: 36px;
            height: 36px;
            img {
                width: 36px;
                height: 36px;
                border: 1px solid #dddddd;
                border-radius: 50%;
            }
        }
        .info {
            margin-left: 60px;
            display: inline-block;
            width: calc(100% - 60px);
            .creator {
                height: 32px;
                line-height: 32px;
                a {
                    color: #4a6495;
                    text-decoration-line: none;
                }
            }
            .content {
                min-height: 32px;
            }
        }
    }
    .input-with-select {
        width: 0px;
        margin-right: 10px;
        .el-input-group__prepend {
            background-color: #409eff;
            border-color: #409eff;
            color: #ffffff;
            border-radius: 4px;
        }
        &.reject .el-input-group__prepend {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .el-input__inner {
            width: 0;
            padding: 0;
            border: 0;
        }
        .el-input__suffix {
            left: 8px;
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