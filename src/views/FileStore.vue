<template>
    <div id="app">
        <TopBar />

        <div class="container">
            <Aside />
            <div class="main">
                <div class="main-top">
                    <div style="flex:1 1  auto;">
                        <el-upload class="upload-demo" name="files" :show-file-list="false" action="/api/v1/files/uploadAll"  :http-request="uploadFile"  :accept="accept" :on-success="handleSuccess" :auto-upload="true" :with-credentials="true" multiple>
                            <i class="iconfont  el-icon-yunshangchuan_o el-icon--right"></i> 点击上传
                        </el-upload>
                    </div>
                    <div class="actbtns">
                        <!-- <i>747.2M / 10G</i> -->
                       <!-- <i class="el-icon-tickets"></i> 
                         <i class="el-icon-sort" title="排序"></i> -->
                       <i class="icon iconfont el-icon-menu" title="菜单" style="cursor:pointer;font-size:16px" @click="list_status = false" v-if="list_status"></i>
                       <i class="icon iconfont el-icon-apps" title="菜单" style="cursor:pointer;font-size:13px" @click="list_status = true" v-if="!list_status"></i>

                       
                    </div>
                </div>
                <div class="main-container">
                    <!-- <div class="file" :key="item.title" v-for="item in items" @click="preview(item)">
                        <el-popover placement="top" trigger="hover" :open-delay="300" width="150">
                            <div>
                                <i class="el-icon-download" @click="downloadFile(item.url)" style="cursor:pointer">下载</i> &nbsp;
                                <i class="el-icon-view" @click="previewFile(item)" style="cursor:pointer"> 预览</i> &nbsp;
                            </div>
                            <div slot="reference">
                                <div class="imgsqu">
                                    <img :src="item.iconUrl" width="100" alt="" class="view">
                                </div>
                                <div class="title">{{item.name}}</div>
                            </div>
                        </el-popover>
                    </div> -->
                    <div v-for="item in  items" :key="item.id" style="float:left;margin-right:20px;" v-show="list_status">
                        <div style="margin-bottom:25px;">
                             <FilesOperate :item="item" :options="{preview:true,download:true,del:true}" @getId="getId"></FilesOperate>
                        </div>
                           
                    </div>
                    <div class="noData" v-if="items.length == 0">
                            <img src="../assets/noData.png" width="200"/>
                        <div>暂无数据！</div>
                    </div>
                    <div style="width:100%" v-show="!list_status && items.length > 0">
                         <el-table :data="items"  style="width: 100%">
                            <el-table-column
                            prop="name"
                            label="文件名称"
                            min-width="20%">
                            </el-table-column>
                              <el-table-column
                            prop="uname"
                            label="上传人"
                             min-width="20%">
                            </el-table-column>
                            <el-table-column
                            prop="type"
                            label="文件类型"
                             min-width="20%">
                            </el-table-column>
                              <el-table-column
                            prop="created"
                            label="上传时间"
                             min-width="20%">
                            </el-table-column>

                    <el-table-column
                        fixed="right"
                        label="操作"
                         min-width="20%">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                <el-button type="text" icon="el-icon-delete" @click="getId(scope.row.id)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="下载" placement="top">
                                <el-button type="text" icon="el-icon-download" @click="downloadFile(scope.row.url,scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="预览" placement="top">
                                <el-button type="text" icon="el-icon-view" @click="preview(scope.row)"></el-button>
                            </el-tooltip>
                        </template>
                        </el-table-column>
                          
                    </el-table>

                    </div>
                </div>
                <div style="padding:0px 30px;"  v-if="items.length > 0">
                    <el-pagination background :current-page="1" :page-sizes="[50, 100, 150, 200]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" @current-change="currentPage" @size-change="sizeChange" :total="params.total">
                </el-pagination>
                </div>
                 
            </div>
        </div>
    </div>
</template>

<script>
import Aside from "../components/Aside.vue";
import TopBar from "@/components/TopBar.vue";
import FilesOperate from "../apps/FilesOperate";
import axios from "axios";

export default {
    name: "filestore",
    props: ["type"],
    data() {
        return {
            items: [],
            accept:"",
            list_status:true,
             params: {
                total: 0, //总数
                pageSize: 50, //当前页面条数
                currentPage: 1, //当前页面索引,
                value: "all"
            }
        };
    },
    components: {
        TopBar,
        Aside,
        FilesOperate
    },
    methods: {
        uploadFile(f) {
            var formdata = new FormData(); //创建form对象
            formdata.append("files", f.file); //通过append向form对象添加数据
            formdata.append("personal", true); //通过append向form对象添加数据
            let config = {
                headers: { "Content-Type": "multipart/form-data" }
            }; //添加请求头
            axios
                .post(f.action, formdata, config) //上传图片
                .then(response => {
                      for (let file of response.data) {
                        this.items.unshift({
                            iconUrl: file.iconUrl,
                            id: file.id,
                            name: file.name,
                            organId: this.$store.getters.LoginData.oid,
                            organName: this.$store.getters.LoginData.oname,
                            size: file.size,
                            type: file.type,
                            uid: file.uid,
                            uname: this.$store.getters.LoginData.uname,
                            url: file.url,
                            created:file.created
                        });
            }
                });
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
        getId(id) {
            let self = this;
            self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                self.items.forEach(function(value, index) {
                    if (value.id == id) {
                        axios
                            .get("/api/v1/disk/delete/"+id)
                            .then(res => {
                                self.items.splice(index, 1);
                            });
                    }
                });
            });
        },
        preview(file) {
            this.common.preview(file);
        },
        handleSuccess(response, file) {
            for (let file of response) {
                this.items.unshift({
                    iconUrl: file.iconUrl,
                    id: file.id,
                    name: file.name,
                    organId: this.$store.getters.LoginData.oid,
                    organName: this.$store.getters.LoginData.oname,
                    size: file.size,
                    type: file.type,
                    uid: file.uid,
                    uname: this.$store.getters.LoginData.uname,
                    url: file.url,
                    created:file.created
                });
            }
        },
        getData() {
            var obj = {
                doc: "文档",
                pic: "图片",
                mov: "视频"
            };
            var uploadType = {
                doc: ".pdf,.PDF,.doc,.docx,.xls,.xlsx,.txt",
                pic: ".jpg,.jpeg,.png",
                mov: ".mp4,.avi,.mov"
                
            }
            this.accept = uploadType[this.type];
            var json = {
                desc: true,
                options: [
                    {
                        field: "uid",
                        filter: "EQUAL",
                        value: this.$store.getters.LoginData.uid
                    },
                    {
                        field: "type",
                        filter: "IN",
                        value: obj[this.type]
                    }
                ],
                orderBy: "created",
                page:  this.params.currentPage,
                pageSize: this.params.pageSize,
            };
            axios.post("/api/v1/disk/list", json).then(res => {
                this.items = res.data.forms;
                this.params.total = res.data.totalCount;
            });
        },
        downloadFile(url,item) {
        this.common.download(url,item);

        },
        previewFile(item){
            this.common.preview(item);
        },
    },
    watch: {
        $route(to, from) {
            this.getData();
        }
    },
    mounted() {
        this.getData();
    }
};
</script>

<style lang="scss" scoped>
.main {
    width: 100%; // overflow: auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.main-top {
    background: #f4f4f4;
    height: 40px;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    padding-left: 10px;
    color: #005a9e;
    .actbtns {
        width:30px;
    }
    .actbtns i {
        font-size: 16px;
        margin-right: 10px;
        font-style: normal;
        color: #858f97;
        // color:
    }
}

.main-container {
    display: flex;
    // flex: 1 1 auto;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    border-top: 1px solid #eaeaea;
    padding: 30px 30px 30px 30px;
    overflow: scroll; // height: 100%;

    .file {
        border: 1px solid #fff;
        width: 128px;
        padding: 5px;
        overflow: hidden;
        margin: 0 0px 20px 0;

        // border-radius: 6px;
        .title {
            color: #222;
            font-size: 16px;
            font-weight: 500;
            line-height: 22px;
            margin-bottom: 9px;
            margin-top: 14px;
            position: relative;
        }

        .imgsqu {
            display: flex;
            align-items: center;
            width: 100px;
            height: 130px;
            overflow: hidden;
            border: 1px solid #dcdada;
            background: #fff;
            margin: auto;

            .view {
                width: 100%;
                align-items: center;
                transition: all 0.3s;
            }
        }
        :hover {
            .view {
                transform: scale(1.2);
            }
        }
    }

    .file:hover {
        border-radius: 3px;
        color: #fff;
        cursor: pointer;

        .title {
            color: #005a9e;
        }
    }
}

.noData {
    padding-top: 100px;
    margin: auto;
    text-align: center;
    color: #999;
    font-size: 14px;
}
</style>
