<template>
    <div id="app">
        <TopBar/>
        <div class="portal">
            <div class="portalList">
                <div style="padding:15px 10px" v-if="type == 'newsList' || type =='newsListToList'">
                    <router-link :to="{path:'/portal'}">首页</router-link> >
                    <router-link :to="'/portal/list/newsListToList'+'/'+page">新闻中心</router-link>
                </div>
                <div style="padding:15px 10px" v-if="type != 'newsList' && type !='newsListToList' && type !='duban' ">
                    <router-link :to="{path:'/portal'}">首页</router-link> >
                    <router-link :to="'/portal/list/'+type+'/'+ page">{{name}}</router-link>
                </div>
                <div style="padding:15px 10px" v-if="type == 'duban'">
                    <router-link :to="{path:'/portal'}">首页</router-link>
                </div>
                <div class="content">
                    <!-- {{data.url[0]}} -->
                    <el-button type="primary" :disabled="!this.showreadedColor" v-if="(this.type == 'outgoing' ||this.type == 'anno' || this.type == 'nstitution') && this.showReadButton" :class="{colorshowccc:!this.showreadedColor,colorshowfff:this.showreadedColor}" @click="hasreaded" style="position:absolute; top:10px; right:10px;">已阅</el-button>
                    <div class="title">
                        <h3>{{data.title}}</h3>
                        <p>
                            发布时间：{{data.time}} &nbsp; &nbsp; 发布人：{{data.publisher}} &nbsp; &nbsp;来源：{{data.source}} &nbsp; &nbsp;
                            <span v-if="type == 'duban'">
                                督办类型：{{data.lamp}} &nbsp; &nbsp; 截止日期：{{data.deadline}}&nbsp; &nbsp; 被督办部门负责人:{{data.inspector}}
                            </span>
                        </p>
                    </div>
                    <div style="text-align:center" v-if="pdfUrl">
                        <div style="width:100%;background:#FFF;height:60px; position:relative; z-index:999"></div>
                        <iframe width="100%" height="1000px" :src="pdfUrl" frameborder="0" style="margin-top:-52px;"></iframe>
                    </div>
                    <div v-html="data.content" class="newsContentDetails" v-if="data.content"></div>
                    <div style="text-align:left; padding:30px; border-top:1px solid #f1f1f1;position:relative;z-index:9999;background:#FFF" v-if="data.url && data.url.length>0">
                        <div>附件：</div>
                        <br />
                        <div v-for="url of data.url" :key="url.type" style="color:#0066cc;display:block;line-height:2; cursor:pointer; font-size:18px;">
                            <img src="@/assets/arrow2.png" style="top:15px;"> &nbsp;
                            <span @click="windowPreview(url.url)"> {{url.name}}</span> &nbsp; &nbsp; &nbsp;
                            <a :href="url.url" :download="url.name">下载</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="contennt">
                    <img src="@/assets/footerlogo.png" width="228px" />
                    <div style="float:right">
                        <p>运维电话：18510862905运维邮箱：18510862905@163.com</p>
                        <p>Copyright 2019 DHC software Co. Ltd.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import axios from 'axios';
import moment from 'moment';
import PdfJs from './PdfJs';
export default {
    name: 'apps',
    props: ['appname'],
    data() {
        return {
            pdfUrl: '',
            data: {},
            inspectors: [],
            name: '',
            showReadButton: false,
            showreadedColor: false
        };
    },
    components: {
        TopBar,
        PdfJs
    },
    props: ['type', 'id', 'page'],
    watch: {},
    methods: {
        showPreview(url) {
            this.common.preview(url);
        },
        getInspector() {
            const self = this;
        },
        windowPreview(url) {
            console.log(process.env.NODE_ENV);
            if (process.env.NODE_ENV === 'production') {
                url =
                    'http://124.205.31.66:2097/static/edit.html?removeBar=true&&url=' +
                    url;
            } else {
                url =
                    'http://static1.yxpe.com.cn/edit.html?removeBar=true&&url=' +
                    url;
            }
            ntkoBrowser.openWindow(url);
            console.log(url);
        },
        hasreaded() {
            const self = this;
            console.log(this);
            let params = {};
            if (this.type == 'outgoing') {
                params = {
                    formId: this.id,
                    uname: this.$store.getters.LoginData.uid
                };
            } else {
                params = {
                    formId: this.id,
                    uname: this.$store.getters.LoginData.uid,
                    type: this.type == 'anno' ? '1' : '0'
                };
            }

            let url = '';
            if (this.type == 'outgoing') {
                url = '/api/v1/outgoing_forms/updateRead';
            } else if (this.type == 'anno') {
                url = '/api/v1/publish_forms/updateRead';
            } else if (this.type == 'nstitution') {
                url = '/api/v1/publish_forms/updateRead';
            }
            axios
                .post(url, JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    this.showReadButton = false;
                })
                .catch(function() {
                    self.$message({
                        message: '设置已读失败',
                        type: 'error'
                    });
                });
        }
    },
    filters: {
        formatTxt: function(txt) {
            return txt.split('/files/')[1];
        }
    },
    mounted() {
        this.getInspector();
        let xml = {
            newsList: '新闻中心',
            anno: '通知公告',
            outgoing: '集团发文',
            nstitution: 'nstitution',
            briefing: '工作简报',
            meetingTable: '集团会表',
            addressList: '集团通讯录',
            nstitution: '规章制度',
            partyActive: 'partyBuilding'
        };

        this.name =
            xml[this.type] == 'partyBuilding' ? '党建活动' : xml[this.type];
        let params = {
            id: this.id
        };

        axios
            .get('/api/v1/portal/details', {
                params: params
            })
            .then(res => {
                let data = res.data.data;
                if (data.text && JSON.parse(data.text).name) {
                    if (process.env.NODE_ENV === 'production') {
                        this.pdfUrl =
                            'http://124.205.31.66:2097/static/edit.html?removeBar=true&url=' +
                            JSON.parse(data.text).url;
                    } else {
                        this.pdfUrl =
                            'http://static1.yxpe.com.cn/edit.html?removeBar=true&url=' +
                            JSON.parse(data.text).url;
                    }
                    data.url.push(JSON.parse(data.text));
                } else if (data.url && data.url.length > 0) {
                    if (
                        'PDF,DOCX,PPTX,XLSX,DOC,XLS'.includes(
                            data.url[0].type.toUpperCase()
                        )
                    ) {
                        if (process.env.NODE_ENV === 'production') {
                            this.pdfUrl =
                                'http://124.205.31.66:2097/static/edit.html?removeBar=true&url=' +
                                data.url[0].url;
                            // data.url.splice(0,1);
                        } else {
                            this.pdfUrl =
                                'http://static1.yxpe.com.cn/edit.html?removeBar=true&url=' +
                                data.url[0].url;
                            // data.url.splice(0,1);
                        }
                    }
                }
                this.data = data;
                let aa = true;
                if (this.data.readMan) {
                    let bb = this.data.readMan.split(',');
                    for (let data of bb) {
                        if (data == this.$store.getters.LoginData.uid) {
                            aa = false;
                        }
                    }
                    if (aa) {
                        this.showReadButton = true;
                        this.showreadedColor = false;
                        setTimeout(() => {
                            this.showreadedColor = true;
                        }, 10000);
                    } else {
                        this.showReadButton = false;
                    }
                } else {
                    this.showReadButton = true;
                    this.showreadedColor = false;
                    setTimeout(() => {
                        this.showreadedColor = true;
                    }, 10000);
                }
                /** 
                if (
                    this.data.readMan &&
                    this.data.readMan.includes(
                        this.$store.getters.LoginData.uid
                    )
                ) {
                    this.showReadButton = false;
                } else {
                    this.showReadButton = true;
                }
                */
            });

        if (this.type == 'duban') {
            let self = this;

            let type = this.$store.getters.LoginData.code.split('_')[0];
            axios
                .get(`/api/v1/users/role/${type}_deptManager`)
                .then(res => {
                    self.inspectors = res.data;

                    axios
                        .get('/api/v1/inspect_forms/get/' + params.id)
                        .then(res => {
                            let demo = self.inspectors.filter(item => {
                                return res.data.inspector == item.id;
                            });
                            if (demo.length > 0) {
                                demo = demo[0].name;
                            }
                            this.data = {
                                title: res.data.title,
                                publisher: res.data.creatorName,
                                source: res.data.organName,
                                time: res.data.done,
                                lamp: res.data.lamp,
                                inspector: demo,
                                deadline: res.data.deadline,
                                content: res.data.content,
                                url: res.data.attachments
                            };
                        });
                })
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

<style lang="scss">
#app {
    overflow: auto;
}
.portal {
    background: #f0f0f0;
    .footer {
        padding: 40px;
        background: #fff;
        .contennt {
            width: 1200px;
            margin: 0px auto;
            p {
                margin: 3px;
                font-size: 13px;
            }
        }
    }
}
.portalList {
    width: 1200px;
    margin: 30px auto;
    .content {
        text-align: center;
        min-height: 700px;
        background: #fff;
        border-radius: 5px;
        padding-bottom: 30px;
        position: relative;
        .colorshowccc {
            background-color: #ccc;
            border-color: #ccc;
        }
        .colorshowfff {
            background-color: #337bb1;
            border-color: #337bb1;
        }
        .newsContentDetails {
            padding: 0px 90px;
            text-align: left;
            font-size: 18px;
            line-height: 1.8em;
            min-height: 300px;
            img {
                display: block;
                margin: 0 auto;
                max-width: 100%;
            }
        }
    }
    .title {
        h3 {
            padding: 50px 20px 0px 20px;
            font-size: 24px;
        }
        p {
            font-size: 14px;
        }
        text-align: center;
        padding-bottom: 30px;
    }
}
</style>

