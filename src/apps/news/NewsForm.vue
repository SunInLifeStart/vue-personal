<template>
    <div id="NewsForm">
        <el-form ref="formupdate" :model="rows" :rules="rules" label-width="100px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="简介">
                        <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" v-model="rows.brief"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="rows.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="副标题">
                        <el-input v-model="rows.btitle"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="信息内容">
                        <!--
                        <div @drop="drop($event)">
                            <el-input type="textarea" :autosize="{minRows: 10}" v-model="rows.content"></el-input>
                        </div>
                        -->
                        <div v-loading="loading">
                            <VueEditor style="width: 100%" useCustomImageHandler @imageAdded="handleImageAdded" :editorToolbar="customToolbar" v-model="rows.content"></VueEditor>
                            <div style="color:#bb4747">*新闻内容中的图片推荐宽高比例为3:2</div>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="关键词">
                        <el-autocomplete class="inline-input" v-model="rows.keywords" :fetch-suggestions="querySearch" style="width: 100%;"></el-autocomplete>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报送单位" prop="reportingOrg">
                        <el-select v-model="rows.reportingOrg" multiple filterable allow-create default-first-option placeholder="请选择报送单位" style="width:100%">
                            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                    
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="发布到">
                    <el-col :span="6">
                        <el-checkbox label="公司网站" v-model="rows.toSite"></el-checkbox>
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox label="公司门户" v-model="rows.toPortal"></el-checkbox>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-checkbox label="微信" v-model="rows.toWechat"></el-checkbox>
                    </el-col>
                    <el-col :span="6">
                        <el-checkbox label="微博" v-model="rows.toWeibo"></el-checkbox>
                    </el-col> -->
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div style="color:#bb4747;padding-left:100px;line-height:30px;">*公司门户图片,推荐宽高比例为16:9,且必须上传</div>
                    <el-form-item label="公司门户图片">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" @click.native="setType('group')" :before-upload="beforeAvatarUpload" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left" v-show="item.attType == 'group'">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachment"></FilesOperate>
                        </div>
                        <!--
                        <div class="attachments" v-for="item in rows.attachments" :key="item.id" @click="downloadFile(item)">
                            <img class="el-icon-document" :src="item.iconUrl" @dragstart="drag($event)" @dragover="allowDrop($event)">
                            <p :title="item.name">{{item.name}}</p>
                            <i class="el-icon-delete" @click.stop="deleteAttachment(item.id)"></i>
                        </div>
                        -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="附件">
                        <el-upload name="files" class="upload-demo uploadBtn" ref="upload" action="/api/v1/files/upload" @click.native="setType('attachment')" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" :show-file-list="false">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <div v-for="item in rows.attachments" :key="item.id" style="float:left" v-show="item.attType == 'attachment'">
                            <FilesOperate :item="item" :options="{preview:true,del:true,download:true}" @getId="deleteAttachment"></FilesOperate>
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
import { VueEditor } from 'vue2-editor';
export default {
    name: 'NewsForm',
    data() {
        return {
            customToolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ align: [] }],
                ['image'],

                [{ size: [] }],

                [{ color: [] }, { background: [] }]
            ],
            dom: '',
            loading: false,
            dialogFormVisible: false,
            dialogDisabled: false,
            showType: '',
            rows: {
                attachments: [],
                reportingOrg:[],
                content: '',
                toPortal: true
            },
            cookie_oname: '',
            rules: {
                title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ]
            },
            options:[],
            currentFormId: this.operationType == 'create' ? '' : this.formId
        };
    },
    components: {
        FilesOperate,
        VueEditor
    },
    props: ['formId', 'operationType', 'attachments'],
    mounted() {
         const self = this;
         self.getSedOrgan();
        if (this.operationType != 'create') {
            this.getForm();
        }
        if (this.attachments) {
            this.rows.attachments = this.attachments;
        }
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
     getSedOrgan() {
            const self = this;
            axios
                .get("/api/v1/organs")
                .then(res => {
                     self.options = res.data;
                })
                .catch(function() {
                    self.$message({
                        message: "操作失败",
                        type: "error"
                    });
                });
        },
        handleImageAdded: function(file, Editor, cursorLocation) {
            var formData = new FormData();
            formData.append('files', file);
            axios
                .post('/api/v1/files/upload?timestamp='+ new Date().getTime(), formData)
                .then(res => {
                    let url = res.data[0].url;
                    Editor.insertEmbed(cursorLocation, 'image', url);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        downloadFile(item) {
            this.common.preview(item);
        },
        getForm() {
            const self = this;
            if (this.formId != '') {
                axios
                    .get('/api/v1/news_forms/' + this.formId)
                    .then(res => {
                        res.data.reportingOrg = res.data.reportingOrg ? res.data.reportingOrg.split(',') : [];
                        self.rows = res.data;
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
            let booleansttatus = false;
            let bolleanattahment = false;
            let haveimg = false;
            if (this.rows.content.match(/<img.+?>/gi)) {
                haveimg = true;
                for (let data of this.rows.attachments) {
                    if (data.attType && data.attType == 'attachment') {
                        bolleanattahment = true;
                    }
                }
            } else {
                bolleanattahment = true;
            }
            for (let data of this.rows.attachments) {
                if (data.attType && data.attType == 'group') {
                    booleansttatus = true;
                }
            }
            if (booleansttatus && bolleanattahment) {
                this.$refs['formupdate'].validate(valid => {
                    if (valid) {
                        this.saveForm();
                        this.$emit('saveStatus', false);
                    }
                });
            } else if (haveimg == true && bolleanattahment == false) {
                this.$message({
                    message: '请选择附件',
                    type: 'error'
                });
            } else {
                this.$message({
                    message: '请选择公司门户图片',
                    type: 'error'
                });
            }
        },
        setType(type) {
            this.showType = type;
        },
        saveForm(action = '') {
            const self = this;
            self.rows.reportingOrg = self.rows.reportingOrg.join(',');
            axios
                .post('/api/v1/news_forms/save',self.rows)
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
        submitCheck() {
            let booleansttatus = false;
            let bolleanattahment = false;
            let haveimg = false;
            if (this.rows.content.match(/<img.+?>/gi)) {
                haveimg = true;
                for (let data of this.rows.attachments) {
                    if (data.attType && data.attType == 'attachment') {
                        bolleanattahment = true;
                    }
                }
            } else {
                bolleanattahment = true;
            }
            for (let data of this.rows.attachments) {
                if (data.attType && data.attType == 'group') {
                    booleansttatus = true;
                }
            }
            if (booleansttatus && bolleanattahment) {
                this.$refs['formupdate'].validate(valid => {
                    if (valid) {
                        this.saveForm('save');
                        this.$emit('saveStatus', false);
                    }
                });
            } else if (haveimg == true && bolleanattahment == false) {
                this.$message({
                    message: '请选择附件',
                    type: 'error'
                });
            } else {
                this.$message({
                    message: '请选择公司门户图片',
                    type: 'error'
                });
            }
        },
        submitForm() {
            const self = this;
            axios
                .post('/api/v1/news/' + this.currentFormId + '/create', '', {
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
                    '/api/v1/news_forms/' +
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
        comment() {
            let self = this;
            axios
                .put(`/api/v1/news_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    action: 'COMMIT',
                    node: '提交'
                })
                .then(res => {});
        },
        startProcess() {
            let to = [];
            let toXML = {
                site: this.rows.toSite,
                portal: this.rows.toPortal,
                wechat: this.rows.toWechat,
                weibo: this.rows.toWeibo
            };
            for (var i in toXML) {
                if (toXML[i]) {
                    to.push(i);
                }
            }
            const self = this;
            const params = {
                action: 'COMMIT',
                to: to
            };
            axios
                .put(
                    '/api/v1/news/' + this.currentFormId + '/signal',
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
        beforeAvatarUpload(file) {
            console.log(file);
            if (
                file.type != '' &&
                'image/jpg,image/jpeg,image/png,image/pjpeg,image/gif,image/bmp,image/x-png'.includes(
                    file.type
                )
            ) {
                return true;
            } else {
                this.$message({
                    message: '格式不对，请选择图片格式',
                    type: 'error'
                });
                return false;
            }
        },
        handleSuccess(response, file) {
            console.log(this.showType);
            const self = this;
            let showGroup = false;
            if (response.length > 0) {
                if (this.showType == 'group') {
                    for (let data of this.rows.attachments) {
                        if (data.attType == 'group') {
                            showGroup = true;
                        }
                    }
                    if (showGroup) {
                        self.$message({
                            message: '只能选择一张图片作为门户图片',
                            type: 'error'
                        });
                    } else {
                        response.forEach(function(item) {
                            self.rows.attachments.push({
                                created: item.created,
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
                                attType: self.showType
                            });
                        });
                    }
                } else {
                    response.forEach(function(item) {
                        self.rows.attachments.push({
                            created: item.created,
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
                            attType: self.showType
                        });
                    });
                }
            }
        },
        getFormData() {
            return this.rows;
        },
        deleteAttachment(id) {
            const self = this;
            if (this.rows.attachments.length > 0) {
                this.$confirm('是否删除?', '提示', { type: 'warning' }).then(
                    () => {
                        const params = {
                            id: id
                        };
                        axios
                            .delete(
                                '/api/v1/news_forms/deleteAtt?id=' + id,
                                '',
                                {
                                    headers: {
                                        'Content-type': 'application/json'
                                    }
                                }
                            )
                            .then(res => {
                                self.rows.attachments.forEach(function(
                                    item,
                                    index
                                ) {
                                    if (item.id == id) {
                                        self.rows.attachments.splice(index, 1);
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
            this.rows = {
                brief: '',
                title: '',
                btitle: '',
                content: '',
                // reportingOrg: this.cookie_oname,
                reportingOrg:[this.cookie_oname],
                keywords: '',
                toSite: null,
                toPortal: true,
                toWechat: null,
                toWeibo: null,
                attachments: []
            };
        },
        querySearch(queryString, cb) {
            const results = [
                {
                    value: '关键词备选'
                }
            ];
            cb(results);
        },
        openDialog(type) {
            if (this.$refs['orgTree']) {
                this.$refs['orgTree'].setCheckedNodes([]);
            }
            this.dialogDisabled = true;
        },
        getCheckedNodes(type) {
            const checkNodes = this.$refs['orgTree'].getCheckedNodes();
            let tmpArray = [];
            checkNodes.forEach(function(node) {
                tmpArray.push(node.label);
            });
            this.rows.reportingOrg = tmpArray.join(',');
        },
        drag(event) {
            this.dom = event.currentTarget;
        },
        drop(event) {
            event.preventDefault();
            if (this.rows.content == '') {
                this.rows.content = '<img src="' + this.dom.src + '">';
            } else {
                this.rows.content += '\n<img src="' + this.dom.src + '">';
            }
        },
        allowDrop(event) {
            event.preventDefault();
        }
    }
};
</script>
<style lang="scss">
#NewsForm {
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
    /**
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
    */
}
</style>