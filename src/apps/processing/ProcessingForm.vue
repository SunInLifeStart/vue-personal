<template>
    <el-dialog title="入职审批" :visible.sync="dialogFormVisible" :close-on-click-modal="false" max-width="1280px" width="70%" style="text-align: center;">
        <div id="ProcessingForm">
            <el-form :model="formData"  :rules="rules" label-width="100px" ref="formData">
                <el-row>
                    <!-- <el-col :span="8">
                        <el-form-item label="流水号:" prop="number">
                            <el-input v-model="formData.number"></el-input>
                        </el-form-item>
                    </el-col> -->
                   <el-col :span="8">
                        <el-form-item label="填表日期" prop="">
                            <!-- <el-date-picker v-model="formData.committed" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                            </el-date-picker> -->
                            <el-input v-model="formData.committed" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="姓名" prop="creatorNamesone">
                            <el-input v-model="formData.creatorNamesone" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别" prop="sex">
                            <el-input v-model="formData.sex" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                       <el-form-item label="出生日期" prop="chusheng">
                            <el-date-picker v-model="formData.chusheng" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                            </el-date-picker>
                            <!-- <el-input v-model="formData.chusheng" ></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="民族" prop="minzu">
                            <el-input v-model="formData.minzu" placeholder="请输入民族"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                         <el-form-item label="籍贯/出生地" prop="jiguan">
                            <el-input v-model="formData.jiguan"></el-input>
                        </el-form-item>
                       
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="户口所在地" prop="hukou">
                            <el-input v-model="formData.hukou"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                    <el-col :span="8">
                        <el-form-item label="身高" >
                            <el-input v-model="formData.shengao" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="血型">
                            <el-input v-model="formData.xuexing" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                       <el-form-item label="婚姻状况">
                            <!-- <el-input v-model="formData.organNames" ></el-input> -->
                             <el-checkbox-group v-model="formData.hunyin">
                                <el-checkbox v-for="city in checkListsone" :label="city" :key="city">{{city}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                    <el-col :span="8">
                        <el-form-item label="外语水平" >
                            <el-input v-model="formData.waiyu" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="职称/职业资格">
                            <el-input v-model="formData.zhicheng" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                       <el-form-item label="政治面貌">
                            <el-input v-model="formData.zhengzhi" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                    <el-col :span="8">
                        <el-form-item label="最高学历" prop="">
                            <el-input v-model="formData.xueli" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电子邮箱">
                            <el-input v-model="formData.youxiang" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                       <el-form-item label="日常交通方式">
                            <!-- <el-input v-model="formData.organNames" ></el-input> -->
                            <el-checkbox-group v-model="formData.jiaotong">
                                <el-checkbox v-for="city in checkListstwo" :label="city" :key="city">{{city}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                    <el-col :span="12">
                        <el-form-item label="身份证号码/护照号ID" prop="">
                            <el-input v-model="formData.shenfen" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                       <el-form-item label="紧急联系人及电话">
                            <el-input v-model="formData.dianhua" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                    <el-col :span="12">
                        <el-form-item label="目前住址" prop="">
                            <el-input v-model="formData.zhuzhi" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                         <el-form-item label="手机/家庭电话">
                            <el-input v-model="formData.shouji" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <table class="tableNoBorder">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="学习及培训经历" prop="">
                                <div style="float: right;">
                                    <span @click="addItem('personal')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                 </div>
                                <el-table :data="formData.requestedItems" border style="width: 100%; margin-top: 5px;" >
                                    <el-table-column prop="" label="起止时间(年月)">
                                        <template slot-scope="scope">
                                            <!-- <el-input v-model="scope.row.content"></el-input> -->
                                            <el-date-picker v-model="scope.row.qizhi" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                                            </el-date-picker>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="毕业院校/培训机构">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.content"></el-input>
                                        </template>
                                    </el-table-column>
                                
                                    <el-table-column prop="" label="所学专业/培训项目">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.fileNum" ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="所得学历">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.fileNum" ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="所得学位">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.fileNum" ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="就读方式">
                                        <template slot-scope="scope">
                                            <!-- <el-input v-model="scope.row.fileNum" ></el-input> -->
                                            <el-radio v-model="scope.row.lendOutType" label="true">统招</el-radio>
                                            <el-radio v-model="scope.row.lendOutType" label="false">自费</el-radio>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="工作经历" prop="">
                                <!-- <tr v-for="(item,index) in formData.attendingDepartment" :key="index" @contextmenu.prevent="deleteItem(item,index,'message')">
                                </tr> -->
                               <div style="float: right;">
                                    <span @click="addItem('message')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                 </div>
                                <el-table :data="formData.attendingDepartment" border style="width: 100%; margin-top: 5px;" >
                                    <el-table-column prop="" label="起止时间">
                                        <template slot-scope="scope">
                                            <!-- <el-input v-model="scope.row.department"></el-input> -->
                                            <el-date-picker v-model="scope.row.departmentime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" type="date" >
                                            </el-date-picker>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="公司名称">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.department"></el-input>
                                        </template>
                                    </el-table-column>
                                
                                    <el-table-column prop="" label="职位名称">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.department" ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="离职原因">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.department" ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="证明人及联系电话">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.department" ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="职责简述">
                                        <template slot-scope="scope">
                                           <el-input v-model="scope.row.department" ></el-input>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="技能" prop="">
                                <el-input type="textarea" placeholder="请描述可证明你专业能力的业绩,例如曾参与过具有挑战性的项目" v-model="formData.creatorNames" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="家庭关系" prop="">
                                <!-- <tr v-for="(item,index) in formData.sitIn" :key="index" @contextmenu.prevent="deleteItem(item,index,'sitIn')">
                                   
                                </tr> -->
                                <div style="float: right;">
                                    <span @click="addItem('sitIn')"><i class="el-icon-circle-plus-outline"></i> 插入</span>
                                 </div>
                                <el-table :data="formData.sitIn" border style="width: 100%; margin-top: 5px;" >
                                    <el-table-column prop="" label="姓名">
                                        <template slot-scope="scope">
                                            <!-- <el-input v-model="scope.row.people"></el-input> -->
                                             <el-select style="width:100%;" clearable v-model="scope.row.useItems" placeholder="请选择">
                                                <el-option
                                                    v-for="item in onOption"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="出生年月">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.people"></el-input>
                                        </template>
                                    </el-table-column>
                                
                                    <el-table-column prop="" label="居住地">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.people" ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="工作单位">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.people" ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="联系电话">
                                        <template slot-scope="scope">
                                            <el-input v-model="scope.row.people" ></el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="" label="备注">
                                        <template slot-scope="scope">
                                           <el-input v-model="scope.row.people" placeholder=""></el-input>
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
                            <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :limit="1" accept="" :auto-upload="true" :with-credentials="true">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <div v-for="item in formData.attachments" :key="item.id" style="float:left">
                                <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId"></FilesOperate>
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
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
    import axios from 'axios';
    import moment from 'moment';
    import FilesOperate from '../FilesOperate';
    import { application } from "../application.js";
    import { publicMethods } from "../application.js";
    export default {
        mixins: [publicMethods],
        name: 'ProcessingForm',
        data() {
            return {
                dialogFormVisible: false,
                checkListsone:['未婚','已婚','离异'],
                checkListstwo:['自驾','公共交通'],
                rules: {
                    creatorNamesone: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                     sex: [
                        { required: true, message: '请输入性别', trigger: 'blur' }
                    ],
                     chusheng: [
                        { required: true, message: '请输入出生日期', trigger: 'blur' }
                    ],
                     minzu: [
                        { required: true, message: '请输入民族', trigger: 'blur' }
                    ],
                     jiguan: [
                        { required: true, message: '请输入籍贯', trigger: 'blur' }
                    ],
                     hukou: [
                        { required: true, message: '请输入户口', trigger: 'blur' }
                    ],
                     creatorNamesone: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                     creatorNamesone: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    number: [
                        { required: true, message: '请输入流水号', trigger: 'blur' }
                    ],
                    branchlineTo: [
                        { required: true, message: '请输入会议类型', trigger: 'blur' }
                    ],
                    committed: [
                        { required: true, message: '请输入提单时间', trigger: 'blur' }
                    ],
                    meetingTime: [
                        { required: true, message: '请输入开会时间', trigger: 'blur' }
                    ]
                },
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
                        value: '工会章',
                        label: '工会章'
                    },
                    {
                        value: '儿子',
                        label: '儿子'
                    },
                    {
                        value: '女儿',
                        label: '女儿'
                    },
                ],
                personOptions: [],
                formData: this.resetForm(),
                users: [],
                uploadId: 0,
                formLabelWidth: '120px',
                appFlowName: "motor-meetingApply_application-meeting",
                currentFormId: this.operationType == 'create' ? '' : this.formId
            };
        },
        components: {
            FilesOperate
        },
        watch: {
            
        },
        mounted() {
            this.getDiscussionUser()
        },
        methods: {
            async getDiscussionUser() {
                let user = await this.getUsers("/api/v1/users")
                if (user) this.personOptions = user.data
            },
            changePeople() {
                this.$forceUpdate()
            },
            deleteItem(item, index, type) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                    if (type == 'message' && this.formData.attendingDepartment.length > 1) {
                        this.formData.attendingDepartment.splice(index, 1);
                    } else if (type == 'personal' && this.formData.requestedItems.length > 1) {
                        this.formData.requestedItems.splice(index, 1);
                    } else if (type == 'sitIn' && this.formData.sitIn.length > 1) {
                        this.formData.sitIn.splice(index, 1);
                    } else {
                        this.$message({
                            message: '最后一组不能删除',
                            type: 'error'
                        });
                    }
                });
            },
            addItem(type) {
                if (type == 'message') {
                    this.formData.attendingDepartment.push({});
                } else if (type == 'personal') {
                    this.formData.requestedItems.push({})
                } else if (type == 'sitIn') {
                    this.formData.sitIn.push({})
                }
            },
            getId(id) {
                let self = this;
                self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                    self.formData.attachments.forEach(function(value, index) {
                        if (value.id == id) {
                            axios
                                .get('/api/v1/board_meeting_forms/deleteAtt/' + id)
                                .then(res => {
                                    self.formData.attachments.splice(index, 1);
                                });
                            self.formData.attachments.splice(index, 1);
                        }
                    });
                });
            },
            resetForm() {
                let formData =  {
                    creatorNamesone:"",
                    sex:"",
                    chusheng:"",
                    minzu:"",
                    jiguan:"",
                    hukou:"",
                    shengao:"",
                    xuexing:"",
                    hunyin:"",
                    waiyu:"",
                    zhicheng:"",
                    zhengzhi:"",
                    xueli:"",
                    youxiang:"",
                    jiaotong:"",
                    shenfen:"",
                    zhuzhi:"",
                    dianhua:"",
                    shouji:"",
                    attachments: [],
                    attendingDepartment: [{
                        // people: [],
                        department: ''
                    }],
                    requestedItems: [{
                        qizhi:"",
                    }],
                    sitIn: [{
                        // people: "",
                        // department: ''
                    }],
                    numbers: '',
                    branchlineTo: '',
                    businessType: '',
                    created: '',
                    sendMessage: [],
                    idea: '',
                    committed: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
                    meetingPlace: '',
                    meetingTime: '',
                    conferenceTitle: '',
                    organName: this.$store.getters.LoginData.oname || '',
                    creatorName: this.$store.getters.LoginData.uname || '',
                    creatorId: this.$store.getters.LoginData.uid || '',
                    organId: this.$store.getters.LoginData.oid || ''
                }
                return formData
            },
            getForm() {
                const self = this;
                if (this.formId != '') {
                    axios
                        .get('/api/v1/meetingApply/detail/' + this.formId)
                        .then(res => {
                            self.formData = res.data.content;
                            // self.$nextTick(() => {
                                if (self.formData.attendingDepartment) {
                                    self.formData.attendingDepartment.forEach(item => {
                                        if (item.person) {
                                            item.people = item.person.split(',')
                                        }
                                        for (let i = 0; i<item.people.length; i++) {
                                            item.people[i] = parseInt(item.people[i])
                                        }
                                    })
                                    self.formData.sitIn.forEach(item => {
                                        if (item.person) {
                                            item.people = item.person.split(',')
                                        }
                                        if (item.people) {
                                            for (let i = 0; i<item.people.length; i++) {
                                                item.people[i] = parseInt(item.people[i])
                                            }
                                        } else {
                                            item.people = []
                                        }
                                    })
                                }
                            // })
                        })
                }
            },
            setDataFromParent(data) {
                this.formId = data.id;
                this.getForm()
                this.dialogFormVisible = true;
                this.createForm_status = false;
            },
            createForm() {
                this.formData = this.resetForm();
                this.dialogFormVisible = this.createForm_status = true;
            },
            saveFormValidate(type) {
                this.$refs['formData'].validate(valid => {
                    if (valid) {
                        if (this.formData.attendingDepartment[0].people && this.formData.attendingDepartment[0].people.length > 0) {
                            this.saveForm(type);
                        } else {
                            this.msgTips("请添加参会人员", "error");
                        }
                    }
                });
            },
            async saveForm(params) {
                const $self = this;
                this.formData.sendMessage = []
                $self.formData.attendingDepartment.forEach(item => {
                    if (item.people) {
                        item.person = item.people.join(',')
                        this.formData.sendMessage = this.formData.sendMessage.concat(item.people)
                    }
                })
                $self.formData.sitIn.forEach(item => {
                    if (item.people) {
                        item.person = item.people.join(',')
                        this.formData.sendMessage = this.formData.sendMessage.concat(item.people)
                    }
                })
                this.formData.sendMessage = this.formData.sendMessage.join(',')
                if (this.formData.sendMessage &&this.formData.sendMessage.length <= 0) {
                    delete this.formData.sendMessage
                }
                // let business = this.discussionOption.filter((item) => { return item.value === this.formData.branchlineTo})
                if (business.length > 0)
                this.formData.businessType = business[0].value + '_' +  business[0].label
                let response = await $self.saveFormData(
                    "/api/v1/meetingApply/save",
                    $self.formData
                );
                if (response) {
                    $self.formId = response.data.content.id;
                    $self.dialogFormVisible = false;
                    if (params) {
                        $self.msgTips("提交成功", "success");
                        if (this.createForm_status) {
                            $self.startSignalForStart(); //如果是 "新建提交" 启动工作流（调用两次）
                        } else {
                            let actions = await $self.getActions(); //如果是 "编辑提交" 启动工作流（调用一次）
                            actions.data.types = actions.data.types.filter(
                                function(item) {
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
                        $self.msgTips($self, "提交失败", "warning");
                    } else {
                        $self.msgTips($self, "保存失败", "warning");
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
                this.$refs.upload.clearFiles();
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
            border: 1px solid #DBDFE6;
            color: #000;
            height: 35px;
            vertical-align: middle;
            .span1{
                color:red;
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
    .tableNoBorder >>> .el-input--small .el-input__inner{
        border: none;
    }
    #ProcessingForm >>> .el-form-item__content{
        width: calc(100% - 140px);
    }
     #ProcessingForm >>> .el-checkbox{
         width: 30px;
    }
</style>