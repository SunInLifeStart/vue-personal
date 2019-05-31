<template>
    <div id="app">
        <TopBar />
        <div class="container">
            <div id="library">
                <el-card class="box-card">
                    <el-button type="primary" size="small" @click="dialogTableVisible = true">上传文档</el-button>
                    <el-dialog title="分享文档" :visible.sync="dialogTableVisible" width="460px">
                        <el-row>
                            <el-col :span="24">
                                <el-upload class="upload-demo" drag name="files" ref="upload" accept=".pdf,.PDF,.doc,.docx,.xls,.xlsx,.txt" action="/api/v1/files/upload" :on-success="handleSuccess" :on-remove="handleRemove" :auto-upload="true" :with-credentials="true">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或
                                        <em>点击上传</em>
                                    </div>
                                </el-upload>
                            </el-col>
                            <el-col :span="24">
                                <el-select style="width:100%;margin-top:10px;" v-model="formData.solrAllShow">
                                    <el-option v-for="item in formData.docPowerList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="24" v-show="formData.solrAllShow == 2">
                                <el-select style="width:100%;margin-top:10px;" v-model="formData.solrShowUserIds" multiple filterable allow-create default-first-option placeholder="请选择指定用户">
                                    <el-option v-for="item in allUsers" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="24">
                                <el-select style="width:100%;margin-top:10px;" v-model="formData.tags" multiple filterable allow-create default-first-option placeholder="请选择文章分类">
                                    <el-option v-for="item in allTags" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" style="width:100px;" size="small" @click="share">分 享</el-button>
                        </div>
                    </el-dialog>
                    <p class="nav-title">最新文档</p>
                    <div class="pointer">
                        <el-row>
                            <el-col class="doc" :span="4" :key="doc.id" v-for="(doc,index) in lasts" v-if="index <=15">
                                <FilesOperate :item="doc" :options="{preview:true,download:true,del:currrentUserId == doc.uid}" @getId="getId"></FilesOperate>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
                <br>
                <el-card class="box-card">
                    <div>
                        <el-row>
                            <el-col :span="24" style="margin-left:0px">
                                <ul class="nav-list">
                                    <li @click="getCurrentTagData('all')" v-bind:class="{tagActive: currentTagActive == -1}">
                                        <el-tag size="30">所有</el-tag>
                                    </li>
                                    <li v-for="(item,index) in  allTags" :key="index" @click="getCurrentTagData(item.value,index)" v-bind:class="{tagActive: currentTagActive == index}">
                                        <el-tag size="30">{{item.value}}</el-tag>
                                    </li>

                                    <!-- <li @click="getHotTags">
                                        <el-tag size="30">更多标签...</el-tag>
                                    </li> -->
                                    <!-- <el-dialog title="更多标签" :visible.sync="dialogVisible1" width="30%">
                                        <h3>热门标签</h3>
                                        <ul class="more">
                                            <li v-for="(item,index) in  hotTags" :key="index" v-bind:class="{ 'first-tags': index==0 }" @click="getData(item.value)">
                                                <el-tag>{{item.value}}</el-tag>
                                            </li>
                                        </ul>
                                        <h3>其他标签</h3>
                                        <ul class="more">
                                            <li v-for="(item,index) in  allTags" :key="index" v-if="index >3" v-bind:class="{ 'first-tags': index==4 }" @click="getData(item.value)">
                                                <el-tag>{{item.value}}</el-tag>
                                            </li>
                                        </ul>
                                    </el-dialog> -->
                                </ul>
                            </el-col>
                        </el-row>
                        <el-row class="pointer">
                            <el-col class="doc" :span="4" :key="doc.id" v-for="doc in all">
                                <!-- <div class="doc-inner" @click="previewFile(doc)">
                                     <el-popover placement="top" trigger="hover" :open-delay="300" width="150">
                                        <div>
                                            <i class="el-icon-download" @click="downloadFile(doc.url)" style="cursor:pointer">下载</i> &nbsp;
                                            <i class="el-icon-view" @click="previewFile(doc)" style="cursor:pointer"> 预览</i> &nbsp;
                                        </div>
                                        <div slot="reference">
                                            <div class="imgsqu">
                                                <img :src="doc.iconUrl" width="100" alt="" class="view">
                                            </div>
                                            <div class="title">{{doc.name}}</div>
                                        </div>
                                    </el-popover>
                                </div> -->
                                <FilesOperate :item="doc" :options="{preview:true,download:true,del:currrentUserId == doc.uid}" @getId="getId"></FilesOperate>
                            </el-col>
                        </el-row>
                        <br />
                        <el-pagination background :current-page="1" :page-sizes="[35, 70, 105, 140]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" @current-change="currentPage" @size-change="sizeChange" :total="params.total">
                        </el-pagination>

                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import { mapGetters } from 'vuex';
import axios from 'axios';
import FilesOperate from '../apps/FilesOperate';
export default {
    name: 'Library',
    data() {
        return {
            currentTagActive: -1, //当前标签选中的索引
            dialogTableVisible: false, //显示或隐藏弹出框
            dialogVisible1: false,
            formData: {
                forms: [], //提交的表单数据
                tags: [], //提交的tags
                docPowerList: [
                    {
                        value: 0,
                        label: '仅自己可见'
                    },
                    {
                        value: 1,
                        label: '所有人可见'
                    },
                    {
                        value: 2,
                        label: '指定用户可见'
                    }
                ],
                solrAllShow: 0,
                solrShowUserIds: []
            },
            currrentUserId: '',
            allUsers: [],
            //   requestTime: 0, //第一次请求获取最新文档
            lasts: [], //最新文档
            all: [], //总表单数据
            allTags: [], //所有的标签
            hotTags: [], //所有热标签
            value10: [],
            params: {
                total: 0, //总数
                pageSize: 35, //当前页面条数
                currentPage: 1, //当前页面索引,
                value: 'all'
            }
        };
    },
    computed: {
        ...mapGetters(['LoginData'])
    },
    components: {
        TopBar,
        FilesOperate
    },
    methods: {
        uploadFile(f) {
            var formdata = new FormData(); //创建form对象
            formdata.append('files', f.file); //通过append向form对象添加数据
            formdata.append('personal', true);
            // formdata.append("token", new Date().getTime()); //通过append向form对象添加数据
            let config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };
            axios
                .post(f.action, formdata, config) //上传图片
                .then(response => {
                    for (let file of response.data) {
                        this.formData.forms.push({
                            iconUrl: file.iconUrl,
                            id: file.id,
                            name: file.name,
                            organId: this.$store.getters.LoginData.uid,
                            organName: this.$store.getters.LoginData.oname,
                            size: file.size,
                            type: file.type,
                            uid: file.uid,
                            uname: this.LoginData.name,
                            url: file.url
                        });
                    }
                });
        },
        getId(id) {
            let self = this;
            self.$confirm('是否删除?', '提示', { type: 'warning' }).then(() => {
                self.lasts.forEach(function(value, index) {
                    if (value.id == id) {
                        axios.get('/api/v1/share/delete/' + id).then(res => {
                            self.lasts.splice(index, 1);
                        });
                    }
                });
            });
        },
        downloadFile(url) {
            this.common.download(url);
        },
        previewFile(item) {
            this.common.preview(item);
        },
        handleSuccess(response, file) {
            for (let file of response) {
                this.formData.forms.push({
                    iconUrl: file.iconUrl,
                    id: file.id,
                    name: file.name,
                    organId: this.$store.getters.LoginData.uid,
                    organName: this.$store.getters.LoginData.oname,
                    size: file.size,
                    type: file.type,
                    uid: file.uid,
                    uname: this.LoginData.name,
                    url: file.url
                });
            }
        },
        handleRemove(response, file) {},
        share() {
            if (this.formData.forms.length > 0) {
                this.formData.tags = this.formData.tags.join(',');
                axios
                    .post('/api/v1/share/save', {
                        tags: this.formData.tags,
                        forms: this.formData.forms
                    })
                    .then(res => {
                        this.$refs.upload.clearFiles();
                        this.formData.forms = [];
                        this.dialogTableVisible = false;
                        //  this.getData();
                        for (let file of res.data) {
                            this.lasts.unshift({
                                iconUrl: file.iconUrl,
                                id: file.id,
                                name: file.name,
                                organId: this.$store.getters.LoginData.uid,
                                organName: this.$store.getters.LoginData.oname,
                                size: file.size,
                                type: file.type,
                                uid: file.uid,
                                uname: this.LoginData.name,
                                url: file.url
                            });
                        }
                        this.formData.tags = this.formData.tags.split(',');
                        this.addOneSolr(res.data);
                    });
            } else {
                this.$message({
                    message: '请先上传文档！',
                    type: 'error'
                });
            }
        },
        preview(doc) {
            this.common.download(doc.url);
        },
        addOneSolr(data) {
            let self = this;
            for (let doc of data) {
                let obj = {
                    solrType: 'document',
                    solrTitle: doc.name,
                    solrLink: doc.iconUrl,
                    solrFileAddress: doc.url,
                    solrAllShow: self.formData.solrAllShow
                };
                if (
                    self.formData.solrAllShow == 2 &&
                    self.formData.solrShowUserIds.length > 0
                ) {
                    obj.solrShowUserIds = self.formData.solrShowUserIds.join(
                        ','
                    );
                }
                axios.post('/solr/addOneSolr', obj).then(res => {});
            }
        },
        currentPage(pageNum) {
            //页面切换
            this.params.currentPage = pageNum;
            this.getData();
        },

        sizeChange(pageCount) {
            //改变当前页面条数
            this.params.pageSize = pageCount;
            this.getData();
        },
        getCurrentTagData(tagValue, index) {
            //获取当前tag是数据
            if (tagValue == 'all') {
                this.currentTagActive = -1;
                this.getData();
            } else {
                this.currentTagActive = index;
                this.getData(tagValue);
            }
        },
        getData(tagValue) {
            //获取总数居
            axios
                .post('/api/v1/share/list', {
                    page: this.params.currentPage,
                    pageSize: this.params.pageSize,
                    desc: true,
                    orderBy: 'created',
                    options: [
                        {
                            field: 'tags',
                            filter: 'LIKE',
                            // filter:  tagValue ? tagValue : this.params.value
                            value: tagValue || ''
                        }
                    ]
                })
                .then(res => {
                    if (tagValue == '') {
                        this.lasts = res.data.forms;
                        // if(res.data.forms.length > 16){
                        //     this.lasts = this.lasts.splice(0,15);
                        // }
                    }
                    // if(tagValue){
                    //     let filterArr = [];
                    //     for(let item  of  res.data.forms){
                    //         if(tagValue.indexOf(item.tags) > -1 || !item.tags ){
                    //             filterArr.push(item);
                    //         }

                    //     }
                    //     res.data.forms = filterArr;
                    // }
                    this.all = res.data.forms;
                    this.params.total = res.data.totalCount;
                });
            this.dialogVisible1 = false;
        },
        getTags() {
            //获取所有标签
            // axios.get("/api/v1/share/tags").then(res => {});
            this.allTags = [
                {
                    value: '公文',
                    label: '公文'
                },
                {
                    value: '金融',
                    label: '金融'
                },
                {
                    value: '科技',
                    label: '科技'
                },
                {
                    value: '人文',
                    label: '人文'
                },
                {
                    value: '地理',
                    label: '地理'
                },
                {
                    value: '制度',
                    label: '制度'
                }
            ];
        },
        getHotTags() {
            //获取所哟热标签
            this.dialogVisible1 = true;
            this.hotTags = [
                {
                    value: '公文',
                    label: '公文'
                },
                {
                    value: '金融',
                    label: '金融'
                },
                {
                    value: '科技',
                    label: '科技'
                },
                {
                    value: '人文',
                    label: '人文'
                },
                {
                    value: '地理',
                    label: '地理'
                }
            ];
            if (this.hotTags.length == 0) {
                axios.get('/api/v1/share/hot/10').then(res => {
                    //    this.
                });
            }
        },
        getAllUsers() {
            axios.get('/api/v1/users').then(res => {
                this.allUsers = res.data;
            });
        }
    },
    mounted() {
        this.currrentUserId = this.$store.getters.LoginData.uid;
        this.getTags();
        this.getData('');
        this.getAllUsers();
    }
};
</script>

<style lang="scss" scoped>
.container {
    background: #f3f3f3;
    overflow-y: auto;
    overflow-x: hidden;
}

.doc {
    width: 120px;
    padding: 0px 10px;
    height: 200px;
    img {
        border: 1px solid #dcdada;
    }
}

.upload-demo {
    text-align: center;
}

#library {
    width: 1240px;
    margin: 20px auto;
    .pointer {
        div {
            img {
                cursor: pointer;
            }
            p {
                cursor: pointer;
            }
        }
    }
    .upload-demo .el-upload-dragger {
        width: 30px !important;
        height: 30px !important;
        margin-top: 5px;
        margin-left: 10px;
    }
    .nav-title {
        font-weight: bold;
    }
    h3 {
        margin: 0 0 10px 0;
    }
    .user-img {
        width: 40px;
        height: 40px;
        margin-right: 15px;
    }
    .uplode-num {
        border: 1px solid #045efb;
        width: 200px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: #045efb;
    }
    .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin: 5px 0 5px 0;
    }
    .name {
        color: #736e6e;
        font-size: 14px;
        margin: 5px 0 30px 0;
    }
    .more {
        display: inline-block;
        margin-bottom: 15px;
        li {
            height: 25px;
            cursor: pointer;
        }
    }
    .el-col-4 {
        margin: 0 14px;
    }
    .nav-list {
        padding: 5px 10px 10px 20px;
        margin: 0px;
        overflow: hidden;
        cursor: pointer;
        li {
            list-style: none;
            float: left;
            line-height: 25px;
            padding: 3px 10px;
        }
        .tagActive {
            border-radius: 3px;
            span {
                background: #337bb1;
                color: #fff;
            }
        }
        li.first-tags {
            margin-left: 0px;
            font-weight: 400;
        }
    }
}
</style>


