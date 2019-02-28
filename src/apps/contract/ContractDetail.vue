<template>
    <div id="ContractDetail" :class="{fullScreen:fullScreen}">
        <div id="actionList" :class="{btnhide:actions.length == 0}">
            <el-row>
                <div>
                    <span v-for="action in actions" :key="action.type" class="btnList" @click="doAction(action)">
                        {{action.name}}
                    </span>
                </div>
            </el-row>
        </div>
        <div class="hehe">
            <p v-show="(this.showView && this.showViews) || (this.showGui && !this.showGuis)"> 注意：阅览无误后，请确认已经将纸质版合同归档至风控部，再点击“同意”并提交流程。</p>
            <p v-show="this.showGui && this.showGuis"> 注意：阅览无误后，请确认发起人已将纸质版合同归档，再点击“归档”并提交流程。</p>
        </div>
        <div class="formContent">
            <el-steps :active="crumb.index" finish-status="success" class="crumbList">
                <el-step :description="item.name" icon="el-icon-check" :key="item.id" v-for="item in crumb.items"></el-step>
            </el-steps>
            <el-form :model="tabledata" class="formList" label-width="120px" ref="formupdate">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="合同名称：">{{tabledata.contractName}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <!-- <el-form-item label="合同类型：">{{tabledata.contractType}}</el-form-item> -->
                        <el-form-item label="合同类型：" prop="contractType">
                            <!-- <el-select v-model="tabledata.contractType" @change="getContractNum()" :disabled="pneumatic == false"> -->
                            <el-select v-model="tabledata.contractType" @change="getContractNum()" :disabled='disable'>
                                <el-option v-for="item in contractTypes" :key="item.id" :label="item.name" :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="14">
                        <el-form-item label="合同编号：" prop="contractNum">
                            <el-input v-model="tabledata.contractNum" @blur="saveForm('合同信息')" :disabled='disable'></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="经办人：">{{tabledata.manager}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="甲方：">{{tabledata.partyA}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="乙方：">{{tabledata.partyB}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="其他方：">{{tabledata.otherParty}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="合同金额：">{{tabledata.contractAmount}}</el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="合同期限：">{{created}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否历史合同：">{{tabledata.historyContract}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="历史合同已付金额：" label-width="160px">{{tabledata.historyContractAmount}}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="合同谈判情况:" label-width="160px" v-if="this.riskWarningShow">
                            <el-input type="textarea" :autosize="{minRows: 2}" v-model="tabledata.contractNegotiation" @blur="saveForm('合同谈判情况')"></el-input>
                        </el-form-item>
                        <el-form-item label="合同谈判情况：" label-width="160px" v-else>{{tabledata.contractNegotiation}}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="合同内容摘要:" label-width="160px" v-if="this.riskWarningShow">
                            <el-input type="textarea" :autosize="{minRows: 2}" v-model="tabledata.contentAbstract" @blur="saveForm('合同内容摘要')"></el-input>
                        </el-form-item>
                        <el-form-item label="合同内容摘要：" label-width="160px" v-else>{{tabledata.contentAbstract}}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="风险提示或说明：" label-width="160px" v-show="tabledata.riskWarning">{{tabledata.riskWarning}}</el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="正文：" v-if="!fengkong1 && !fengkong2">
                            <div v-for="item in  tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType0'">
                                <FilesOperate :item="item" :options="attachmentsOpertions" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                        <el-form-item label="正文：" v-if="fengkong1">
                            <div v-for="item in  tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType0'">
                                <FilesOperate :item="item" :options="{preview:true,download:true,upload:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                            </div>
                        </el-form-item>
                        <el-form-item label="正文：" v-if="fengkong2">
                            <div v-for="item in  tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType0'">
                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="附件：" v-if="this.riskWarningShow">
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" @click.native="attType = 'attType1'" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in  tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType1'">
                                <FilesOperate :item="item" :options="{preview:true,download:true,upload:true,del:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                            </div>
                        </el-form-item>
                        <el-form-item label="附件：" v-else>
                            <div v-for="item in  tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType1'">
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
                                        <el-form-item label="合同所涉经济行为批准文件" label-width="210px" v-if="this.riskWarningShow">
                                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" @click.native="attType = 'attType2'" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <div v-for="item in  tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType2'">
                                                <FilesOperate :item="item" :options="{preview:true,download:true,upload:true,del:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="合同所涉经济行为批准文件" label-width="210px" v-else>
                                            <div v-for="item in  tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType2'">
                                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                                            </div>
                                        </el-form-item>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <el-form-item label="合同相对方资质证照复印件" label-width="210px" v-if="this.riskWarningShow">
                                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" @click.native="attType = 'attType3'" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <div v-for="item in  tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType3'">
                                                <FilesOperate :item="item" :options="{preview:true,download:true,upload:true,del:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="合同相对方资质证照复印件" label-width="210px" v-else>
                                            <div v-for="item in  tabledata.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attType3'">
                                                <FilesOperate :item="item" :options="{preview:true,download:true}" @getId="getId"></FilesOperate>
                                            </div>
                                        </el-form-item>
                                    </td>
                                </tr>
                            </table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="tabledata.comments && tabledata.comments.length > 0">
                    <el-col :span="24">
                        <h3>审批意见</h3>
                        <div class="items">
                            <div class="item" v-for="item in tabledata.comments" :key="item.id">
                                <div class="avatar"><img src="img/avatar.1176c00a.png" alt="" width="30px"></div>
                                <div class="info">
                                    <div class="creator">
                                        <span href="#">{{item.creatorName}}</span> &nbsp; ({{item.created | dateformat}})
                                    </div>
                                    <div class="content">{{item.content}}</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <el-dialog :visible.sync="dialogVisible" center width="30%" append-to-body>
                <el-form>
                    <el-form-item label="请选择驳回节点" v-show="reject_status">
                        <el-select v-model="rejectTarget" style="width:100%;">
                            <el-option v-for="user in rejectList" :key="user" :label="user" :value="user">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="seleteUserLabel" v-show="presign_status">
                        <el-select v-model="seleteUsers" filterable multiple style="width:100%;">
                            <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审批意见">
                        <el-input type="textarea" placeholder="请输入审批意见" v-model="textarea" :autosize="{ minRows: 4, maxRows: 30}">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="风险提示或说明" v-if="riskWarningShow">
                        <el-input type="textarea" placeholder="" v-model="tabledata.riskWarning" :autosize="{ minRows: 4, maxRows: 30}" @blur="saveFormRis()">
                        </el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitForm()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog :visible.sync="dispatchDialog" center width="30%" append-to-body>
                <el-form>
                    <el-form-item label="审批意见">
                        <el-input type="textarea" placeholder="请输入审批意见" v-model="textarea" :autosize="{ minRows: 4, maxRows: 30}">
                        </el-input>
                    </el-form-item>
                </el-form>
                <div :model="selectItem">
                    <el-checkbox v-model="selectItem.managerApproval" :disabled="selectItem.managerApproval && selectItem.chairmanApproval">请总经理批示</el-checkbox>
                    <el-checkbox v-model="selectItem.chairmanApproval" @change="selcetAll">请董事长批示</el-checkbox>
                </div>
                <div style="text-align: center; margin-top: 15px;">
                    <el-button @click="dispatchDialog = false">取 消</el-button>
                    <el-button type="primary" @click="confirm()">确定</el-button>
                </div>
            </el-dialog>
        </div>
        <ContracteditFiles ref="contracteditFiles" @editWordData="editWordData"></ContracteditFiles>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Comment from '../Comment';
import cookies from 'js-cookie';
import FilesOperate from '../FilesOperate';
import ContracteditFiles from './ContracteditFiles.vue';
export default {
    name: 'ContractDetail',
    data() {
        return {
            attType: '',
            crumbNodeName: '',
            fullScreen: false,
            tabledata: {},
            attachmentsOpertions: {
                preview: true,
                download: false,
                change: false
            },
            counts: 0,
            showView: false,
            showGui: false,
            showViews: false,
            showGuis: false,
            budgetCheck: [],
            auditSituationChecked: '',
            created: '',
            actions: [],
            actionApprove: [],
            crumb: { items: [] },
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
            pneumatic: false, //风控标识
            dispatchDialog: false,
            selectItem: {
                id: this.formId,
                chairmanApproval: false,
                managerApproval: false
            },
            actions_status: false,
            users: [],
            rejectTarget: '',
            rejectList: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: '',
            textarea: '',
            dialogVisible: false,
            currentAction: '',
            submitData: {},
            disable: true,
            riskWarningShow: false,
            fengkong1: false,
            fengkong2: false,
            comcname: '',
            addPrint: false
        };
    },
    props: ['formId'],
    components: {
        Comment,
        FilesOperate,
        ContracteditFiles
    },
    mounted() {
        const self = this;
        this.getForm();
        if (this.formId != '') {
            // this.getForm();
            this.getCrumbs();
            // this.getActions();
            this.getAllUsers();
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
            this.getCrumbs();
            // this.getActions();
        }
    },
    methods: {
        selcetAll() {
            if (this.selectItem.chairmanApproval) {
                this.selectItem.managerApproval = true;
            }
        },
        editWordData(data) {
            if (!data.url) {
                return false;
            }
            this.tableData.text = {
                iconUrl: data.icon_url,
                name: data.originalFilename,
                url: data.url,
                path: data.path,
                file_name: data.file_name,
                pdfUrl:
                    data.url.split('files')[0] +
                    'pdf' +
                    data.url.split('files')[1]
            };
            this.saveForm();
            this.$refs.contracteditFiles.clearTime();
        },
        getReviseData(repelaceData) {
            let self = this;
            self
                .$confirm('确定要替换吗，替换后原文件将被删除?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    self.tabledata.attachments.forEach(function(value, index) {
                        if (
                            value.id == repelaceData.id &&
                            value.attType == repelaceData.item.attType
                        ) {
                            axios
                                .get(
                                    '/api/v1/contract_forms/deleteAttachment/' +
                                        repelaceData.id
                                )
                                .then(res => {
                                    self.tabledata.attachments.splice(index, 1);
                                    self.tabledata.attachments.push({
                                        created: repelaceData.data.created,
                                        iconUrl: repelaceData.data.iconUrl,
                                        id: repelaceData.data.id,
                                        name: repelaceData.data.name,
                                        organId: repelaceData.data.organId,
                                        uid: repelaceData.data.uid,
                                        uname: repelaceData.data.uname,
                                        url: repelaceData.data.url,
                                        attType: repelaceData.item.attType
                                    });
                                    self.saveFormContract();
                                });
                        }
                    });
                });
        },
        saveFormContract() {
            const self = this;
            axios
                .post('/api/v1/contract_forms/save', this.tabledata)
                .then(res => {})
                .catch(function() {});
        },
        getId(id) {
            const self = this;
            if (this.tabledata.attachments.length > 0) {
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
                                self.tabledata.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.tabledata.attachments.splice(
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
        handleSuccess(response, file) {
            for (let item of response) {
                this.tabledata.attachments.push({
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
            this.saveForm();
        },
        //获得合同编号
        getContractNum() {
            const self = this;
            for (let item of this.contractTypes) {
                if (item.name == this.tabledata.contractType) {
                    this.type = encodeURI(item.id);
                }
            }
            const year = moment()
                .utc()
                .format('YYYY');
            const dept = this.getDept(encodeURI(this.cookie_oname));
            axios
                .get(
                    '/api/v1/contract_forms/contractNum/year/' +
                        year +
                        '?type=' +
                        this.type +
                        '&dept=' +
                        dept
                )
                .then(res => {
                    self.contractNum1 = res.data;
                    self.tabledata.contractNum = self.contractNum1;
                    this.saveForm();
                })
                .catch(function() {
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
        saveForm(info) {
            if (this.tabledata.contractType && this.tabledata.contractNum) {
                const self = this;
                axios
                    .post('/api/v1/contract_forms/save', this.tabledata)
                    .then(res => {
                        // if (info) {
                        //     self.$message({
                        //     message: info + '保存成功',
                        //     type: 'success'
                        // });
                        // }
                    })
                    .catch(function() {
                        self.$message({
                            message: '保存失败',
                            type: 'error'
                        });
                    });
            }
        },
        saveFormRis() {
            const self = this;
            if (this.tabledata.riskWarning) {
                axios
                    .post('/api/v1/contract_forms/save', this.tabledata)
                    .then(res => {})
                    .catch(function() {
                        self.$message({
                            message: '风险提示或说明保存失败',
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
                        self.tabledata = res.data;
                        this.selectItem.chairmanApproval = this.tabledata.chairmanApproval;
                        this.selectItem.managerApproval = this.tabledata.managerApproval;
                        if (self.tabledata.effectiveEnd) {
                            self.tabledata.effectiveStart =
                                self.tabledata.effectiveStart;
                            self.tabledata.effectiveEnd =
                                self.tabledata.effectiveEnd;
                            self.created =
                                self.tabledata.effectiveStart +
                                ' 至 ' +
                                self.tabledata.effectiveEnd;
                        } else {
                            self.created = '';
                        }
                        this.getActions();
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
        confirm() {
            this.dispatchDialog = false;
            // const coma = ;
            this.tabledata.chairmanApproval = this.selectItem.chairmanApproval;
            this.tabledata.managerApproval = this.selectItem.managerApproval;
            axios
                .post('/api/v1/contract_forms/save', this.tabledata)
                .then(res => {
                    this.submitForm();
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
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        getActions() {
            let self = this;
            this.showViews = false;
            this.showGuis = false;
            axios.get(`/api/v1/contracts/${this.formId}/actions`).then(res => {
                res.data.types = res.data.types || [];
                if (this.addPrint && res.data.types.length > 0) {
                    res.data.types.push({
                        type: 'print',
                        name: '打印'
                    });
                }

                if (this.tabledata.status == '已完成') {
                    res.data.types.push({
                        type: 'print',
                        name: '打印'
                    });
                }
                if (this.fullScreen) {
                    res.data.types.push({
                        type: 'closeFullScreen',
                        name: '关闭全屏'
                    });
                } else {
                    res.data.types.push({
                        type: 'fullScreen',
                        name: '全屏显示'
                    });
                }
                self.actions = res.data.types;
                for (let item of self.actions) {
                    if (item.name == '同意') {
                        this.showViews = true;
                    }
                    if (item.name == '归档') {
                        this.showGuis = true;
                    }
                }
                this.addPrint = false;
            });
        },
        getCrumbs() {
            this.pneumatic = false;
            this.showView = false;
            this.showGui = false;
            this.attachmentsOpertions.preview = true;
            this.attachmentsOpertions.download = false;
            axios.get(`/api/v1/contracts/${this.formId}/crumb`).then(res => {
                for (let item of res.data) {
                    if (
                        item.name == '风控' &&
                        item.active == true &&
                        item.key == 'Task_04' &&
                        (cookies.get('uname') == '赵桂平' ||
                            cookies.get('uname') == '吕红' ||
                            cookies.get('uname') == '况亚军')
                    ) {
                        this.disable = false;
                        this.fengkong1 = true;
                    } else if (
                        item.name == '风控' &&
                        item.active == true &&
                        item.key == 'Task_0asezng' &&
                        (cookies.get('uname') == '赵桂平' ||
                            cookies.get('uname') == '吕红' ||
                            cookies.get('uname') == '况亚军')
                    ) {
                        this.disable = false;
                        this.riskWarningShow = true;
                        this.fengkong1 = true;
                    } else if (
                        item.name == '风控' &&
                        item.active == true &&
                        item.key == 'Task_11' &&
                        (cookies.get('uname') == '赵桂平' ||
                            cookies.get('uname') == '吕红' ||
                            cookies.get('uname') == '况亚军')
                    ) {
                        this.fengkong2 = true;
                    }
                    if (
                        item.name == '风控' &&
                        item.active == true &&
                        item.key == 'Task_04'
                    ) {
                        this.pneumatic = true;
                        this.attachmentsOpertions.preview = true;
                        this.attachmentsOpertions.download = false;
                    } else if (
                        item.name == '风控' &&
                        item.active == true &&
                        item.key == 'Task_0asezng'
                    ) {
                        this.pneumatic = true;
                        this.attachmentsOpertions.preview = true;
                        this.attachmentsOpertions.download = true;
                        //少一个替换
                    } else if (item.name == '打印' && item.active == true) {
                        this.attachmentsOpertions.preview = true;
                        this.attachmentsOpertions.download = true;
                    } else if (
                        item.name == '经办人阅览' &&
                        item.active == true
                    ) {
                        this.showView = true;
                        this.showGui = false;
                        this.addPrint = true;
                    } else if (item.name == '归档' && item.active == true) {
                        this.pneumatic = true;
                        this.showView = false;
                        this.showGui = true;
                        this.addPrint = true;
                    }
                }
                this.crumb = { items: res.data, index: -1 };
                res.data.forEach((item, index) => {
                    if (item.active) {
                        this.crumb.index = index;
                        (this.comcname = item.name),
                            (this.crumbNodeName = item.key);
                        if (item.assignes) {
                            item.name = item.name + '(' + item.assignes + ')';
                        }
                    }
                });
            });
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        },
        doAction(action) {
            this.clearForm();
            this.currentAction = action;
            // 不需要弹出框
            if ('DISPATCH,TEMPLATE,PULL,COMMIT,ARCHIVE'.includes(action.type)) {
                this.clearForm();
                let self = this; //套红，归档，分发
                if (action.type == 'PULL') {
                    axios
                        .get(`/api/v1/contracts/${self.formId}/pull`)
                        .then(res => {
                            self.comment('formOnlyComment');
                            self.getActions();
                            self.getCrumbs();
                        });
                }
                if (
                    action.type == 'COMMIT' &&
                    this.crumbNodeName == 'Task_01'
                ) {
                    this.submitForm();
                } else if (action.type == 'COMMIT') {
                    self.dialogVisible = true;
                    if (action.required) {
                        if (action.type == 'COMMIT') {
                            self.presign_status = true;
                            self.seleteUserLabel = '请选择拟办人';
                        }
                    }
                }
                //打印表单的方法
                // if (action.type == 'PRINT') {
                //     this.$print(this.$refs.formupdate.$el);
                //     this.comment();
                // }
                if (action.type == 'ARCHIVE') {
                    this.submitForm();
                }
            } else if ('REJECT,PRESIGN'.includes(action.type)) {
                //拒绝，加签
                this.dialogVisible = true;
                //需要弹出并填写意见，选择驳回节点或选择其他人
                if (action.type == 'REJECT') {
                    this.getRejectList();
                    this.reject_status = true;
                }
                if (action.type == 'PRESIGN') {
                    this.presign_status = true;
                    this.seleteUserLabel = '请选择前加签人';
                }
            } else if (
                'COUNTERSIGN,PURCHASE,REJECT,SUPERIOR,APPROVE,SIGNOUT'.includes(
                    action.type
                )
            ) {
                //拟办，同意
                let compare = true;
                for (let few of this.crumb.items) {
                    if (
                        few.key == 'Task_07' &&
                        few.active &&
                        (action.type == 'APPROVE' || action.type == 'SUPERIOR')
                    ) {
                        compare = false;
                    }
                }
                if (!compare) {
                    this.dispatchDialog = true;
                } else {
                    this.dialogVisible = true;
                }
                //只需要填写意见
            } else if ('fullScreen'.includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: 'closeFullScreen',
                    name: '关闭全屏'
                });
                this.fullScreen = true;
                // this.common.open(`/#/apps/outgoing/${this.formId}`);
            } else if ('closeFullScreen'.includes(action.type)) {
                this.actions.splice(this.actions.length - 1, 1);
                this.actions.push({
                    type: 'fullScreen',
                    name: '全屏显示'
                });
                this.fullScreen = false;
            } else if ('print,PRINT'.includes(action.type)) {
                axios
                    .get('/api/v1/contract_forms/getForm/' + this.formId)
                    .then(res => {
                        this.previewDoc(res.data);
                    });
            } else {
                this.dialogVisible = true;
            }
        },
        previewDoc(url) {
            console.log(url);
            this.$refs.contracteditFiles.openPrinter(url);
        },
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = '';
            this.submitData = {};
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/contract_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name,
                    action: self.currentAction.type,
                    node: self.comcname
                })
                .then(res => {
                    this.getForm();
                    if (comment == 'formOnlyComment') {
                        this.getCrumbs();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                    }
                });
        },
        submitForm() {
            let self = this;
            //如果是不需要走流程的节点
            if (
                'ARCHIVE,SAVE,PREVIEW,COMMENT,PULL,PRINTER,EDIT'.includes(
                    self.currentAction.type
                )
            ) {
                if (self.currentAction.type == 'ARCHIVE') {
                    self.submitData.action = self.currentAction.type;
                    axios
                        .put(
                            `/api/v1/contracts/${self.formId}/signal`,
                            self.submitData
                        )
                        .then(res => {
                            self.dialogVisible = false;
                            self.riskWarningShow = false;
                            self.comment();
                            self.getActions();
                            // self.getForm();
                            self.getCrumbs();
                            self.$message({
                                message: self.currentAction.name + '成功',
                                type: 'success'
                            });
                        });
                }
            } else {
                //退回
                if (self.currentAction.type == 'REJECT') {
                    if (self.seleteUsers) {
                        self.submitData.rejectTarget = self.rejectTarget;
                    } else {
                        self.$message.error('请选择驳回节点');
                        return false;
                    }
                }

                //前加签
                if (self.currentAction.required) {
                    if (self.seleteUsers.length > 0) {
                        var key = self.currentAction.required[0].split(':')[0];
                        self.submitData[key] = self.seleteUsers;
                    } else {
                        self.$message.error(self.seleteUserLabel);
                        return false;
                    }
                }
                self.submitData.action = self.currentAction.type;
                self.submitData.needGeneralManager =
                    self.tabledata.managerApproval;
                self.submitData.needChairman = self.tabledata.chairmanApproval;
                axios
                    .put(
                        `/api/v1/contracts/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.comment();
                        self.getActions();
                        // self.getForm();
                        self.getCrumbs();
                        self.$message({
                            message: self.currentAction.name + '成功',
                            type: 'success'
                        });
                        if (self.currentAction.type == 'CANCEL') {
                            self.$emit('refreshData');
                        }
                    });
            }
        },

        refreshFormData() {
            this.getCrumbs();
            this.getForm();
        },
        setMemo() {
            const self = this;
            axios
                .post('/api/v1/contract_forms/setMemo', {
                    memo: '',
                    id: self.formId
                })
                .then(res => {})
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
<style lang="scss" scope>
#ContractDetail {
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
    .el-step__main {
        margin-top: 10px;
    }
    .hehe {
        color: red;
        padding-left: 65px;
        li {
            font-size: 17px;
        }
    }
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
#actionList {
    background: #f4f4f4;
    border-bottom: 1px solid #eaeaea;
    height: 40px;
    width: 100%;
    z-index: 10;
    font-weight: bold;
    .btnList {
        line-height: 40px;
        padding: 12px 10px;
        cursor: pointer;
    }
    .btnList:hover {
        background: #c7e0f4;
    }
}
.btnhide {
    display: none;
}
.crumbList {
    margin: 15px 0px;
}
.fullScreen {
    position: fixed;
    top: 0px;
    z-index: 10;
    background: #fff;
    left: 0px;
    right: 0px;
}
</style>