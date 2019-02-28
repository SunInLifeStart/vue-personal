<template>
    <div id="ActivityForm">
        <el-form ref="formupdate" :model="rows" :rules="rules" label-width="120px" style="margin-top:10px;">
            <el-row>
                <p style="margin-left:120px; color:#a76666;">* 如与备案信息有出入请更改</p>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="名称">
                        <el-input v-model="rows.title"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="主题">
                        <el-input v-model="rows.theme"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="开始时间">
                        <el-date-picker v-model="rows.time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="结束时间">
                        <el-date-picker v-model="rows.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="地点">
                        <el-input v-model="rows.place"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="主办方" prop="organizer">
                        <el-input v-model="rows.organizer"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="承办方" prop="contractors">
                        <el-input v-model="rows.contractors"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="活动规模">
                        <el-input v-model="rows.scale"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="上报单位">
                        <el-input v-model="rows.organName" disabled="disabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="16">
                    <el-form-item label="联合上报单位">
                        <el-select style="width:100%;" v-model="rows.combinedUnit" filterable multiple readonly default-first-option placeholder="请选择">
                            <el-option v-for="item in combinedUnit" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="参会人员构成">
                        <el-col :span="24">
                            <el-form-item>
                                <el-input v-model="rows.superiorLeader" placeholder="上级领导" style="border:none"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item>
                                <el-select style="width:100%;" v-model="rows.groupLeader" filterable multiple readonly default-first-option placeholder="集团领导">
                                    <el-option v-for="item in groupLeader" :key="item" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item>
                                <el-input v-model="rows.companyLeader" placeholder="公司领导"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="联系人">
                        <el-input v-model="rows.contactUser"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系方式">
                        <el-input v-model="rows.contact"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="是否有外媒">
                        <el-select v-model="rows.isMedia" placeholder="请选择" style="width: 100%;">
                            <el-option label="请选择" value=""></el-option>
                            <el-option label="是" value="是"></el-option>
                            <el-option label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否有外宾">
                        <el-select v-model="rows.isGuedts" placeholder="请选择" style="width: 100%;">
                            <el-option label="请选择" value=""></el-option>
                            <el-option label="是" value="是"></el-option>
                            <el-option label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="拟邀请媒体">
                        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" v-model="rows.invitation"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="上传会议议程">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.attachment" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId1" @getReviseData="getReviseData"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-form-item label="媒体报道">
                        <el-button type="primary" size="small" icon="el-icon-delete" @click="deleteItem()" style="float: right;"></el-button>
                        <el-button type="primary" size="small" icon="el-icon-plus" @click="addItem()" style="margin-right: 10px; float: right;"></el-button>
                        <br>
                        <el-table :data="rows.activityReport.mediaCoverage" border style="width: 100%; margin-top: 20px;" @selection-change="handleSelectionChange">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column prop="name" label="媒体名称" min-width="200" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name" placeholder="请输入媒体名称"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="href" label="新闻链接" min-width="200" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.href" placeholder="请输入新闻链接"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="title" label="报道题目" min-width="200" align="center">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.title" placeholder="请输入报道题目"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" label="报道日期" min-width="250" align="center">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.date" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                </template>
                            </el-table-column>
                            <el-table-column prop="operation" label="报道附件" min-width="200" align="center">
                                <template slot-scope="scope">
                                    <el-upload name="files" class="upload-demo" :ref="'upload' + scope.row.index" action="/api/v1/files/upload" :auto-upload="true" :on-success="setUploadList" :show-file-list="false" v-if="scope.row.attachments.length == 0">
                                        <el-button type="primary" size="small" slot="trigger">选择文件</el-button>
                                    </el-upload>
                                    <div v-if="scope.row.attachments.length > 0" class="attachments_materials">
                                        <p :title="scope.row.attachments[0].name">{{scope.row.attachments[0].name}}</p>
                                        <i class="el-icon-delete" @click.stop="deleteAttachment(scope.row.attachments,scope.row.attachments[0].id)"></i>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="宣传物料">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" multiple :on-success="handleSuccessMaterials" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.activityReport.materials" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="活动照片">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" multiple :on-success="handleSuccessActivity" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.activityReport.activity" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                        </div>

                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="领导讲话">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" multiple :on-success="handleSuccessLeader" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.activityReport.leader" :key="item.id" style="float:left">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="getId" @getReviseData="getReviseData"></FilesOperate>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
import axios from 'axios';
import FilesOperate from '../FilesOperate';
export default {
    name: 'ActivityForm',
    data() {
        return {
            rows: {
                activityReport: {
                    activity: [],
                    mediaCoverage: [],
                    materials: [],
                    leader: []
                }
            },
            submitFormStatus: false,
            cookie_uname: '',
            cookie_oname: '',
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
                '区域合作部',

                '北京中关村软件园发展有限责任公司',
                '北京中关村生命科学园发展有限责任公司',
                '北京中关村科技融资担保有限公司',
                '中关村科技租赁有限公司',
                '中关村医疗器械园有限公司',
                '北京中建中关村生物医药产业投资发展有限公司',
                '北京知识产权运营管理有限公司',
                '北京中关村延庆园建设发展有限公司',
                '北京中关村微纳能源投资有限公司',
                '北京中关村集成电路设计园发展有限责任公司',
                '中关村协同发展投资有限公司',
                '北京中关村协同创新投资基金管理有限公司',
                '北京中关村前沿技术产业发展有限公司',
                '中关村芯园（北京）有限公司',
                '中关村（国际）控股公司',
                '北京中科金投资管理有限公司',
                '北京中关村领创空间科技服务有限责任公司',
                '北京中关村科技创业金融服务集团有限公司',
                '北京集成电路产业发展股权投资基金有限公司',
                '北京实创高科技发展有限责任公司',
                '北京丰台科技园建设发展有限公司',
                '北京中关村电子城建设有限公司',
                '北京兴昌高科技发展有限公司',
                '北京金桥科技产业基地开发有限公司',
                '北京光谷科技园开发建设有限公司',
                '北京京石科园置业发展有限公司',
                '北京东方雍和文化创意投资有限公司',
                '北京海开房地产集团公司',
                '北京中关村国际孵化器有限公司',
                '北京中关村国际环保产业促进中心',
                '北京中关村海外科技园有限责任公司',
                '石家庄中关村协同发展有限公司',
                '天津京津中关村科技城发展有限公司',
                '北京领创精准医疗健康产业投资股份公司',
                '北京怀柔科学城建设发展有限公司',
                '北京中关村京西建设发展有限公司'
            ],
            groupLeader: [
                '赵长山',
                '宣鸿',
                '王明兰',
                '李妍',
                '姚胜利',
                '韩柏',
                '周武光',
                '杨彦茹',
                '邵顺昌',
                '贾一伟',
                '龙宜彬',
                '张哲',
                '段海波',
                '杨彦文',
                '许均华'
            ],
            mediaCoverageIndex: 0,
            currentMediaCoverageIndex: 0,
            selectionItems: [],
            rules: {
                organizer: [
                    {
                        required: true,
                        message: '请输入主办方名称',
                        trigger: 'change'
                    }
                ],
                contractors: [
                    {
                        required: true,
                        message: '请输入承办方名称',
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    components: {
        FilesOperate
    },
    props: ['formId', 'operationType', 'storage'],
    mounted() {
        const self = this;
        this.getForm();
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
            this.getForm();
        }
    },
    methods: {
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/activity_forms/activities/' + this.formId)
                    .then(res => {
                        res.data.combinedUnit =
                            res.data.combinedUnit == ''
                                ? []
                                : res.data.combinedUnit.split(',');
                        res.data.groupLeader =
                            res.data.groupLeader == ''
                                ? []
                                : res.data.groupLeader.split(',');
                        self.rows = res.data;

                        if (!self.rows.activityReport) {
                            self.rows.activityReport = {
                                activity: [],
                                mediaCoverage: [],
                                materials: [],
                                leader: []
                            };
                        }
                        if (
                            self.rows.activityReport &&
                            !self.rows.activityReport.activity
                        ) {
                            self.rows.activityReport.activity = [];
                        }
                        if (
                            self.rows.activityReport &&
                            !self.rows.activityReport.mediaCoverage
                        ) {
                            self.rows.activityReport.mediaCoverage = [];
                        }
                        if (
                            self.rows.activityReport &&
                            !self.rows.activityReport.materials
                        ) {
                            self.rows.activityReport.materials = [];
                        }
                        if (
                            self.rows.activityReport &&
                            !self.rows.activityReport.leader
                        ) {
                            self.rows.activityReport.leader = [];
                        }
                        if (
                            res.data.activityReport &&
                            res.data.activityReport.id
                        ) {
                            this.rows.activityReport.id =
                                res.data.activityReport.id;
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
        saveForm(type) {
            const self = this;
            if (
                self.rows.combinedUnit &&
                Array.isArray(self.rows.combinedUnit)
            ) {
                self.rows.combinedUnit = self.rows.combinedUnit.join(',');
            }
            if (self.rows.groupLeader && Array.isArray(self.rows.groupLeader)) {
                self.rows.groupLeader = self.rows.groupLeader.join(',');
            }

            axios
                .post(
                    '/api/v1/activity_forms/activities/save',
                    JSON.stringify(self.rows),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.rows.combinedUnit = res.data.combinedUnit.split(',');
                    self.rows.groupLeader = res.data.groupLeader.split(',');
                    self.currentFormId = res.data.id;
                    self.saveActivity(type, self.rows);
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        saveActivity(type, data) {
            const self = this;
            const params = {
                activities: {
                    id: self.rows.id
                },
                activity: data.activityReport.activity,
                mediaCoverage: data.activityReport.mediaCoverage,
                materials: data.activityReport.materials,
                leader: data.activityReport.leader
            };
            if (self.rows.activityReport && self.rows.activityReport.id) {
                params.id = self.rows.activityReport.id;
            }

            axios
                .post('/api/v1/activity_forms/save', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    if (type == 'submit') {
                        self.submitFormStatus = true;
                        self.submitForm(res.data.id);
                    } else {
                        self.$emit('refreshData');
                    }
                    self.rows.activityReport.id = res.data.id;
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        submitCheck(type) {
            this.submitForm();
        },
        submitForm(activityId) {
            if (this.submitFormStatus) {
                const self = this;
                axios
                    .post('/api/v1/activities/' + activityId + '/create', '', {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    })
                    .then(res => {
                        if (res.data.id != '') {
                            self.commitForm(activityId, res.data.id);
                        }
                        this.submitFormStatus = false;
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            } else {
                this.saveForm('submit');
            }
        },
        commitForm(activityId, processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/activity_forms/' +
                        activityId +
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
                    self.startProcess(activityId);
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        startProcess(activityId) {
            const self = this;
            const params = {
                action: 'COMMIT'
            };
            axios
                .put(
                    '/api/v1/activities/' + activityId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    this.comment(activityId);
                    self.$emit('refreshData');
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        comment(id) {
            let self = this;
            axios
                .put('/api/v1/activity_forms/' + id + '/comment', {
                    content: '提交',
                    node:'提交',
                    action: 'COMMIT',
                })
                .then(res => {});
        },
        cancelForm() {
            const self = this;
            axios
                .put('/api/v1/activity_forms/' + this.formId + '/cancel', '', {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
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
                    self.rows.attachment.push(item);
                });
            }
        },
        handleSuccessMaterials(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.activityReport.materials.push(item);
                });
            }
        },
        handleSuccessActivity(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.activityReport.activity.push(item);
                });
            }
        },
        handleSuccessLeader(response, file) {
            const self = this;
            if (response.length > 0) {
                response.forEach(function(item) {
                    self.rows.activityReport.leader.push(item);
                });
            }
        },
        downloadFile(item) {
            this.common.preview(item);
        },
        getFormData() {
            return this.rows;
        },
        handleSelectionChange(selection) {
            this.selectionItems = selection;
        },
        addItem() {
            this.rows.activityReport.mediaCoverage.push({
                id: '',
                date: '',
                href: '',
                name: '',
                title: '',
                attachments: [],
                index: this.mediaCoverageIndex++
            });
        },
        deleteItem() {
            const self = this;
            if (this.selectionItems.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        this.selectionItems.forEach(function(oData) {
                            self.rows.activityReport.mediaCoverage.forEach(
                                function(iData, index) {
                                    if (iData.index == oData.index) {
                                        self.rows.activityReport.mediaCoverage.splice(
                                            index,
                                            1
                                        );
                                    }
                                }
                            );
                        });
                    }
                );
            }
        },
        getReviseData(repelaceData) {
            let self = this;
            self
                .$confirm('确定要替换吗，替换后原文件将被删除?', '提示', {
                    type: 'warning'
                })
                .then(() => {
                    self.rows.attachments.forEach(function(value, index) {
                        if (value.id == repelaceData.id) {
                            axios
                                .get(
                                    '/api/v1/activity_forms/deleteAtt/' +
                                        repelaceData.id
                                )
                                .then(res => {
                                    self.rows.attachments.splice(index, 1);
                                    self.rows.attachments.push(
                                        repelaceData.data
                                    );
                                });
                        }
                    });
                });
        },
        getId1(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                axios
                    .get(
                        '/api/v1/activity_forms/activities/deleteAtt/' + id,
                        '',
                        {
                            headers: {
                                'Content-type': 'application/json'
                            }
                        }
                    )
                    .then(res => {
                        self.rows.attachment.forEach(function(item, index) {
                            if (item.id == id) {
                                self.rows.attachment.splice(index, 1);
                            }
                        });
                    })
                    .catch(function() {
                        self.$message({
                            message: '操作失败',
                            type: 'error'
                        });
                    });
            });
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                axios
                    .get('/api/v1/activity_forms/deleteAtt/' + id, '', {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    })
                    .then(res => {
                        self.rows.activityReport.materials.forEach(function(
                            item,
                            index
                        ) {
                            if (item.id == id) {
                                self.rows.activityReport.materials.splice(
                                    index,
                                    1
                                );
                            }
                        });
                        self.rows.activityReport.activity.forEach(function(
                            item,
                            index
                        ) {
                            if (item.id == id) {
                                self.rows.activityReport.activity.splice(
                                    index,
                                    1
                                );
                            }
                        });
                        self.rows.activityReport.leader.forEach(function(
                            item,
                            index
                        ) {
                            if (item.id == id) {
                                self.rows.activityReport.leader.splice(
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
            });
        },
        setUploadList(response, file) {
            const self = this;
            for (
                let i = 0;
                i < this.rows.activityReport.mediaCoverage.length;
                i++
            ) {
                if (response.length > 0) {
                    response.forEach(function(item) {
                        self.rows.activityReport.mediaCoverage[
                            i
                        ].attachments.push(item);
                    });
                }
            }
        },
        deleteAttachment(item, id) {
            const self = this;
            if (item.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };

                        axios
                            .get('/api/v1/activity_forms/deleteAtt/' + id, '', {
                                headers: {
                                    'Content-type': 'application/json'
                                }
                            })
                            .then(res => {
                                item.forEach(function(res, index) {
                                    if (res.id == id) {
                                        item.splice(index, 1);
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
        }
    }
};
</script>
<style lang="scss">
#ActivityForm {
    .uploadBtn {
        margin-bottom: 30px;
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
        margin-bottom: 30px;
        margin-left: 10px;
        width: 100px;
        height: 120px;
        text-align: center;
        float: left;
        border: 1px solid #c0c4cc;
        position: relative;
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
    .attachments_materials {
        margin: 0px;
        padding-top: 10px;
        position: relative;
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
}
</style>