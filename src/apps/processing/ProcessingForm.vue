<template>
    <el-dialog title="入职审批" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="95%" style="text-align: center;">
        <div id="ProcessingForm">
            <el-form :model="formData" :rules="rules" label-width="100px" ref="formData">
                <div v-if="!isFromDetailsEdit">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="员工级别" prop="positions">
                                <el-select v-model="formData.positions" placeholder="请选择员工级别" clearable filterable>
                                    <el-option v-for="item in onOptionone" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="关键程度" prop="isKey">
                                <el-select v-model="formData.isKey" placeholder="请选择关键程度" clearable filterable>
                                    <el-option v-for="item in onOptiontwo" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="申请岗位" prop="applyPosition">
                                <el-input v-model="formData.applyPosition"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="填表日期" prop="fillingTime">
                                <el-input v-model="formData.fillingTime"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="姓名" prop="uname">
                                <el-input v-model="formData.uname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="性别" prop="sex">
                                <el-input v-model="formData.sex"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="出生日期" prop="birthday">
                                <!-- <el-date-picker v-model="formData.birthday" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                                </el-date-picker> -->
                                <el-input v-model="formData.birthday"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="民族" prop="nation">
                                <el-input v-model="formData.nation" placeholder="请输入民族"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="籍贯/出生地" prop="nativePlace">
                                <el-input v-model="formData.nativePlace"></el-input>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="户口所在地" prop="placeDomicile">
                                <el-input v-model="formData.placeDomicile"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="身高">
                                <el-input v-model="formData.stature"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="血型">
                                <el-input v-model="formData.bloodType"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="婚姻状况">
                                <el-radio-group v-model="formData.maritalStatus">
                                    <el-radio :label="0">未婚</el-radio>
                                    <el-radio :label="1">已婚</el-radio>
                                    <el-radio :label="2">离异</el-radio>
                                </el-radio-group>
                                <!-- <el-checkbox-group v-model="formData.maritalStatus">
                                    <el-checkbox v-for="city in checkListsone" :label="city" :key="city">{{city}}</el-checkbox>
                                </el-checkbox-group> -->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="外语水平">
                                <el-input v-model="formData.languageLevel"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="职称/职业资格">
                                <el-input v-model="formData.technicalTitle"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="政治面貌">
                                <el-input v-model="formData.politicsStatus"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="最高学历">
                                <el-input v-model="formData.highestEducation"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="电子邮箱">
                                <el-input v-model="formData.emailAddress"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="日常交通方式">
                                <el-radio-group v-model="formData.byPrep">
                                    <el-radio :label="2">自驾</el-radio>
                                    <el-radio :label="1">公共交通</el-radio>
                                </el-radio-group>

                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="身份证号码/护照号ID">
                                <el-input v-model="formData.idNumber"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="紧急联系人及电话">
                                <el-input v-model="formData.contacts"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="目前住址" prop="">
                                <el-input v-model="formData.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机/家庭电话">
                                <el-input v-model="formData.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <table class="tableNoBorder">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="学习及培训经历" prop="">
                                    <div style="float: right;">
                                        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem('personal')" style="margin-right: 5px;"></el-button>
                                        <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem('0')"></el-button>
                                    </div>
                                    <el-table :data="formData.studyExperience" border style="width: 100%; margin-top: 5px;" @selection-change="handleSelectionChangeone" :row-class-name="tableRowClassNameone" @row-click='showone'>
                                        <el-table-column type="selection" width="70px"></el-table-column>
                                        <el-table-column prop="" label="起止时间(年月)">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.fromTo"></el-input>
                                                <!-- <el-date-picker v-model="scope.row.fromTo" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                                                </el-date-picker> -->
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="毕业院校/培训机构">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.graduateTnstitution"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="所学专业/培训项目">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.major"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="所得学历">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.educationBackground"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="所得学位">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.degree"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="就读方式">
                                            <template slot-scope="scope">
                                                <el-radio v-model="scope.row.studyingWay" label="0">统招</el-radio>
                                                <el-radio v-model="scope.row.studyingWay" label="1">自费</el-radio>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="工作经历" prop="">
                                    <div style="float: right;">
                                        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem('message')" style="margin-right: 5px;"></el-button>
                                        <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem('1')"></el-button>
                                    </div>
                                    <el-table :data="formData.workExperience" border style="width: 100%; margin-top: 5px;" @selection-change="handleSelectionChangeone" :row-class-name="tableRowClassNameone" @row-click='showone'>
                                        <el-table-column type="selection" width="70px"></el-table-column>
                                        <el-table-column prop="" label="起止时间">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.fromTo"></el-input>
                                                <!-- <el-date-picker v-model="scope.row.fromTo" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                                                </el-date-picker> -->
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="公司名称">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.companyName"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="职位名称">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.jobTitle"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="离职原因">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.reasonToLeave"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="证明人及联系电话">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.referenceNumber"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="职责简述">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.jobDescription"></el-input>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="技能" prop="">
                                    <el-input type="textarea" placeholder="请描述可证明你专业能力的业绩,例如曾参与过具有挑战性的项目" v-model="formData.skill"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="家庭关系" prop="">
                                    <div style="float: right;">
                                        <el-button type="primary" size="mini" icon="el-icon-plus" @click="addItem('sitIn')" style="margin-right: 5px;"></el-button>
                                        <el-button type="primary" size="mini" icon="el-icon-delete" @click="deleteItem('2')"></el-button>
                                    </div>
                                    <el-table :data="formData.familyTies" border style="width: 100%; margin-top: 5px;" @selection-change="handleSelectionChangeone" :row-class-name="tableRowClassNameone" @row-click='showone'>
                                        <el-table-column type="selection" width="70px"></el-table-column>
                                        <el-table-column prop="" label="称谓">
                                            <template slot-scope="scope">
                                                <!-- <el-input v-model="scope.row.people"></el-input> -->
                                                <el-select style="width:100%;" clearable v-model="scope.row.appellation" placeholder="请选择">
                                                    <el-option v-for="item in onOption" :key="item.value" :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="姓名">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.name"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="出生年月">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.birthday"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="居住地">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.placeOfAbode"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="工作单位">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.workUnit"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="联系电话">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.contactNumber"></el-input>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="" label="备注">
                                            <template slot-scope="scope">
                                                <el-input v-model="scope.row.remark" placeholder=""></el-input>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </table>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="照片及附件">
                                <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :multiple="true" :show-file-list="false" accept="" :auto-upload="true" :with-credentials="true">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <div v-for="(item,index) in formData.attachments" :key="index" style="float:left">
                                    <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachments(index,formData.attachments)"></FilesOperate>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
                <el-row v-if="isFromDetailsEdit">
                    <el-col :span="24">
                        <h1 style="text-align:center">拟聘人员信息</h1>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名:" prop="positionsWage.name">
                            <el-input v-model="formData.positionsWage.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别:" prop="positionsWage.sex">
                            <el-input v-model="formData.positionsWage.sex"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="定岗:" prop="positionsWage.determinePosts">
                            <el-input v-model="formData.positionsWage.determinePosts"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门:" prop="positionsWage.department">
                            <el-input v-model="formData.positionsWage.department"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职级:" prop="positionsWage.rank">
                            <el-input v-model="formData.positionsWage.rank"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="薪酬:" prop="positionsWage.remuneration">
                            <el-input v-model="formData.positionsWage.remuneration"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="试用期(月):" prop="positionsWage.probationPeriod">
                            <el-input v-model="formData.positionsWage.probationPeriod"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="试用期薪酬标准(%):" prop="positionsWage.percentage">
                            <el-input v-model="formData.positionsWage.percentage"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogSelectCode" width="30%" append-to-body center>
            <el-select v-model="branchCode" placeholder="请选择" style="width:100%">
                <el-option v-for="item in currentRoles" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveFormValidate()">保存</el-button>
                <el-button type="primary" @click="saveFormValidate(true)">提交</el-button>
            </span>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
            <el-button type="default" @click="saveFormValidate()">保存</el-button>
            <el-button type="primary" @click="saveFormValidate(true)" v-if="!isFromDetailsEdit">提交</el-button>
        </div>
    </el-dialog>
</template>
<script>
/* eslint-disable */
import axios from 'axios';
import moment from 'moment';
import FilesOperate from '../FilesOperate';
import { application } from '../application.js';
import { publicMethods } from '../application.js';
export default {
    mixins: [publicMethods],
    name: 'ProcessingForm',
    data() {
        return {
            dialogTitle: '',
            dialogSelectCode: false,
            currentRoles: [],
            branchCode: '',
            uploadImageType: '',
            isFromDetailsEdit: false,
            counts: 0,
            dialogFormVisible: false,
            checkListsone: ['未婚', '已婚', '离异'],
            checkListstwo: ['自驾', '公共交通'],
            rules: {
                'positionsWage.name': [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                'positionsWage.sex': [
                    { required: true, message: '请输入性别', trigger: 'blur' }
                ],
                'positionsWage.determinePosts': [
                    { required: true, message: '请输入定岗', trigger: 'blur' }
                ],
                'positionsWage.department': [
                    { required: true, message: '请输入部门', trigger: 'blur' }
                ],
                'positionsWage.rank': [
                    { required: true, message: '请输入职级', trigger: 'blur' }
                ],
                'positionsWage.remuneration': [
                    { required: true, message: '请输入薪酬', trigger: 'blur' }
                ],
                'positionsWage.probationPeriod': [
                    { required: true, message: '请输入试用期', trigger: 'blur' }
                ],
                'positionsWage.percentage': [
                    { required: true, message: '请输入百分比', trigger: 'blur' }
                ],
                applyPosition: [
                    { required: true, message: '请输入岗位', trigger: 'blur' }
                ],
                positions: [
                    {
                        required: true,
                        message: '请输入员工级别',
                        trigger: 'change'
                    }
                ],
                isKey: [
                    {
                        required: true,
                        message: '请输入关键程度',
                        trigger: 'change'
                    }
                ],
                uname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                sex: [
                    { required: true, message: '请输入性别', trigger: 'blur' }
                ],
                birthday: [
                    {
                        required: true,
                        message: '请输入出生日期',
                        trigger: 'blur'
                    }
                ],
                nation: [
                    { required: true, message: '请输入民族', trigger: 'blur' }
                ],
                nativePlace: [
                    { required: true, message: '请输入籍贯', trigger: 'blur' }
                ],
                placeDomicile: [
                    { required: true, message: '请输入户口', trigger: 'blur' }
                ],
                number: [
                    { required: true, message: '请输入流水号', trigger: 'blur' }
                ],
                fillingTime: [
                    {
                        required: true,
                        message: '请输入填表日期',
                        trigger: 'blur'
                    }
                ]
            },
            onOptionone: [
                {
                    value: '普通员工',
                    label: '普通员工'
                },
                {
                    value: '中层干部',
                    label: '中层干部'
                },
                {
                    value: '高管',
                    label: '高管'
                }
            ],
            onOptiontwo: [
                {
                    value: '是',
                    label: '关键岗位'
                },
                {
                    value: '否',
                    label: '非关键岗位'
                }
            ],
            // 父亲、母亲、配偶、儿子、女儿
            onOption: [
                {
                    value: '父亲',
                    label: '父亲'
                },
                {
                    value: '母亲',
                    label: '母亲'
                },
                {
                    value: '配偶',
                    label: '配偶'
                },
                {
                    value: '儿子',
                    label: '儿子'
                },
                {
                    value: '女儿',
                    label: '女儿'
                }
            ],
            formData: this.resetForm(),
            users: [],
            selectionItemsone: [],
            appFlowName: 'motor-examinationapproval_examinationapproval',
            currentFormId: this.operationType == 'create' ? '' : this.formId
        };
    },
    components: {
        FilesOperate
    },
    watch: {},
    // props: ['formId', 'operationType'],
    mounted() {},
    methods: {
        handleSelectionChangeone(selection) {
            this.selectionItemsone = selection;
        },
        tableRowClassNameone({ row, rowIndex }) {
            //把每一行的索引放进row
            row.index = rowIndex;
        },
        showone(row, event, column) {
            this.uploadImageType = row.index;
        },
        deleteItem(type) {
            const self = this;
            let a = self.formData;
            if (self.selectionItemsone.length > 0) {
                self
                    .$confirm('是否删除?', '提示', { type: 'warning' })
                    .then(() => {
                        self.selectionItemsone.forEach(function(oData) {
                            if (oData.fromTo || oData.appellation) {
                                axios
                                    .get(
                                        '/api/v1/examinationApproval/deleteChild/' +
                                            self.formData.id +
                                            '/' +
                                            oData.index +
                                            '/' +
                                            type,
                                        '',
                                        {
                                            headers: {
                                                'Content-type':
                                                    'application/json'
                                            }
                                        }
                                    )
                                    .then(res => {
                                        if (type == '0') {
                                            self.formData.studyExperience.forEach(
                                                function(item, index) {
                                                    if (
                                                        item.index ==
                                                        oData.index
                                                    ) {
                                                        self.formData.studyExperience.splice(
                                                            index,
                                                            1
                                                        );
                                                        self.$message({
                                                            message: '删除成功',
                                                            type: 'success'
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                        if (type == '1') {
                                            self.formData.workExperience.forEach(
                                                function(item, index) {
                                                    if (
                                                        item.index ==
                                                        oData.index
                                                    ) {
                                                        self.formData.workExperience.splice(
                                                            index,
                                                            1
                                                        );
                                                        self.$message({
                                                            message: '删除成功',
                                                            type: 'success'
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                        if (type == '2') {
                                            self.formData.familyTies.forEach(
                                                function(item, index) {
                                                    if (
                                                        item.index ==
                                                        oData.index
                                                    ) {
                                                        self.formData.familyTies.splice(
                                                            index,
                                                            1
                                                        );
                                                        self.$message({
                                                            message: '删除成功',
                                                            type: 'success'
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    })
                                    .catch(function() {
                                        self.$message({
                                            message: '操作失败',
                                            type: 'error'
                                        });
                                    });
                            } else {
                                if (type == '0') {
                                    self.formData.studyExperience.forEach(
                                        function(item, index) {
                                            if (item.count == oData.count) {
                                                self.formData.studyExperience.splice(
                                                    index,
                                                    1
                                                );
                                            }
                                        }
                                    );
                                }
                                if (type == '1') {
                                    self.formData.workExperience.forEach(
                                        function(item, index) {
                                            if (item.count == oData.count) {
                                                self.formData.workExperience.splice(
                                                    index,
                                                    1
                                                );
                                            }
                                        }
                                    );
                                }
                                if (type == '2') {
                                    self.formData.familyTies.forEach(function(
                                        item,
                                        index
                                    ) {
                                        if (item.count == oData.count) {
                                            self.formData.familyTies.splice(
                                                index,
                                                1
                                            );
                                        }
                                    });
                                }
                            }
                        });
                    });
            }
        },
        addItem(type) {
            if (type == 'message') {
                // 工作经历
                this.formData.workExperience.push({
                    count: ++this.counts
                });
            } else if (type == 'personal') {
                // 学习及培训经历
                this.formData.studyExperience.push({
                    count: ++this.counts
                });
            } else if (type == 'sitIn') {
                // 家庭关系
                this.formData.familyTies.push({
                    count: ++this.counts
                });
            }
        },
        resetForm() {
            let formData = {
                uname: '',
                applyPosition: '',
                positions: '',
                isKey: '',
                sex: '',
                birthday: '',
                nation: '',
                nativePlace: '',
                placeDomicile: '',
                stature: '',
                bloodType: '',
                maritalStatus: '',
                languageLevel: '',
                technicalTitle: '',
                politicsStatus: '',
                highestEducation: '',
                emailAddress: '',
                byPrep: '',
                idNumber: '',
                address: '',
                contacts: '',
                phone: '',
                skill: '',
                attachments: [],
                //工作经历
                workExperience: [
                    {
                        id: '',
                        count: 0,
                        fromTo: '',
                        companyName: '',
                        jobTitle: '',
                        reasonToLeave: '',
                        referenceNumber: '',
                        jobDescription: ''
                    }
                ],
                //学习经历
                studyExperience: [
                    {
                        id: '',
                        count: 0,
                        fromTo: '',
                        graduateTnstitution: '',
                        major: '',
                        educationBackground: '',
                        degree: '',
                        studyingWay: ''
                    }
                ],
                familyTies: [
                    {
                        id: '',
                        count: 0,
                        appellation: '',
                        name: '',
                        birthday: '',
                        placeOfAbode: '',
                        workUnit: '',
                        contactNumber: '',
                        remark: ''
                    }
                ],
                positionsWage: {
                    id: '',
                    name: '',
                    sex: '',
                    determinePosts: '',
                    department: '',
                    rank: '',
                    remuneration: '',
                    probationPeriod: '',
                    percentage: ''
                },
                fillingTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                organName: this.$store.getters.LoginData.oname || '',
                creatorName: this.$store.getters.LoginData.uname || '',
                creatorId: this.$store.getters.LoginData.uid || '',
                organId: this.$store.getters.LoginData.oid || ''
            };
            return formData;
        },
        setDataFromParent(data, status) {
            this.formData = data;
            this.formId = data.id;
            this.dialogFormVisible = true;
            this.createForm_status = false;
        },
        setDataFromParentone(data, status) {
            this.formData = data;
            if (!this.formData.positionsWage) {
                this.formData.positionsWage = {};
            }
            this.formData.positionsWage.name = this.formData.uname;
            this.formData.positionsWage.sex = this.formData.sex;
            this.dialogFormVisible = true;
            this.createForm_status = false;
            this.isFromDetailsEdit = status;
        },
        createForm() {
            this.formData = this.resetForm();
            this.dialogFormVisible = this.createForm_status = true;
            this.branchCode = '';
        },
        saveFormValidate(type) {
            this.$refs['formData'].validate(valid => {
                if (valid) {
                    this.saveForm(type);
                }
            });
        },
        async saveForm(params) {
            const $self = this;
            if ($self.createForm_status) {
                if ((await $self.juderCode()) == 'returnDialog') {
                    return false;
                }
            }
            let response = await $self.saveFormData(
                '/api/v1/examinationApproval/save',
                $self.formData
            );
            if (response) {
                $self.formId = response.data.content.id;
                // $self.dialogFormVisible = false;
                $self.dialogFormVisible = $self.dialogSelectCode = false;
                if (params) {
                    $self.msgTips('提交成功', 'success');
                    if (this.createForm_status) {
                        $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                    } else {
                        let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                        actions.data.types = actions.data.types.filter(function(
                            item
                        ) {
                            return item.action == 'COMMIT';
                        });
                        actions.data.types[0]['comment'] =
                            actions.data.types[0].name;
                        await $self.startSignal(
                            actions.data.types[0],
                            'fromeEdit'
                        );
                        $self.emitMessage();
                    }
                } else {
                    $self.msgTips('保存成功', 'success');
                    if (this.createForm_status) {
                        $self.startSignalForSave(); //如果是 "新建保存"  启动保存工作流(调用一次)
                    } else {
                        $self.emitMessage(); //如果是 "编辑保存" 不启动工作流（不调用）
                    }
                }
            } else {
                if (params) {
                    if (!this.dialogSelectCode) {
                        $self.msgTips('提交失败', 'warning');
                    }
                } else {
                    if (!this.dialogSelectCode) {
                        $self.msgTips('保存失败', 'warning');
                    }
                }
            }
        },
        handleSuccess(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.formData.attachments.push(item);
                });
            }
            // this.$refs.upload.clearFiles();
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        handlePreview() {},
        handleRemove() {}
    }
};
</script>
<style lang="scss" scoped>
#ProcessingForm {
    .tableNoBorder {
        width: 100%;
        table-layout: fixed;
        word-break: break-all;
        border-collapse: collapse;
    }
    table td,
    table th {
        border: 1px solid #dbdfe6;
        color: #000;
        height: 35px;
        vertical-align: middle;
        .span1 {
            color: red;
            margin-right: 5px;
        }
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
}
</style>
<style scoped>
.tableNoBorder >>> .el-input--small .el-input__inner {
    border: none;
}
#ProcessingForm >>> .el-form-item__content {
    width: calc(100% - 140px);
}
#ProcessingForm >>> .el-checkbox {
    width: 30px;
}
#ProcessingForm >>> .el-select {
    width: calc(100% - 2px);
}
</style>