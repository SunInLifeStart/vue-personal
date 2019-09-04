<template>
    <div id="app">
        <TopBar/>
        <div class="portal">
            <div class="portalList">
                <div class="title">
                    <span v-if="name == '集团发文'">
                        公司发文
                    </span>
                    <span v-if="name != '集团发文' && name != '通讯录' ">
                        {{name}}
                    </span>
                    <span v-if="name == '通讯录'">
                        通讯录/会表
                    </span>
                    <div><img src="@/assets/title.png" /></div>
                </div>
                <div style="padding:15px 10px">
                    <router-link :to="{path:'/portal'}">首页</router-link> >
                    <span v-if="name == '集团发文'">
                        公司发文
                    </span>
                    <span v-if="name != '集团发文' && name != '通讯录' ">
                        {{name}}
                    </span>
                    <span v-if="name == '通讯录'">
                        通讯录/会表
                    </span>
                    <el-button size="mini" button v-if="name == '新闻中心'" style="float:right" @click="changeType">{{showSquTips}}</el-button>
                </div>
                <div v-if="showSquTips == '展示列表'" class="newsList">
                    <div class="list" v-for="item of list" :key="item.articleId" @click="routerTo(item)">
                        <div><img :src="item.img"></div>
                        <h3>{{item.title | formTxt(20)}}</h3>
                        <p>{{item.about | formTxt(70)}}</p>
                    </div>
                </div>
                <ul v-if="showSquTips == '展示图表'">
                    <li v-for="item of list" :key="item.articleId">
                        <!--
                        <div v-show="item.showType" style=" width:10px; height:10px; border-radius: 50%;display: inline-block;background:red;position: absolute;left: 15px;top: 15px;"> </div>
                        -->
                        <div style="flex:1;margin-right:10px;"> <img src="@/assets/leader1.png" align="middle"></div>
                        <div style="flex:30" v-if="type != 'yq'">
                            <router-link :to="'/portal/list/'+type+'/' +params.page  +'/'+ item.articleId"> {{item.title | formTxt(35)}}</router-link>
                        </div>
                        <div style="flex:30" v-if="type == 'yq'">
                            <a :href="item.url" target="_blank"> {{item.title | formTxt(35)}}</a>
                        </div>
                        <div style="flex:5">
                            {{item.publisher}}
                        </div>
                        <div style="flex:8">
                            {{item.time}}
                        </div>
                        <div style="flex:2" v-if="type == 'yq'">
                            <a :href="item.url" target="_blank">
                                <el-button size="mini">详情</el-button>
                            </a>
                        </div>
                        <div style="flex:2" v-if="type != 'yq'">
                            <router-link :to="'/portal/list/'+type+'/' +params.page+ '/' + item.articleId">
                                <el-button size="mini">详情</el-button>
                            </router-link>
                        </div>
                    </li>
                </ul>
                <el-pagination background :current-page="params.page" :page-size="params.size" layout="total, prev, pager, next" @current-change="currentPage" :total="params.total"></el-pagination>
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
export default {
    name: 'apps',
    props: ['appname'],
    data() {
        return {
            list: [],
            name: '',
            params: {
                size: 10, //当前页面条数
                page: 1 //当前页面索引,
            },
            showSquTips: '展示图表'
        };
    },
    components: {
        TopBar
    },
    props: ['type', 'page'],
    watch: {},
    methods: {
        changeType() {
            this.showSquTips =
                this.showSquTips == '展示列表' ? '展示图表' : '展示列表';
        },
        timeCompare(time) {
            if (time && time != '') {
                let start = moment(new Date()).format('YYYY-MM-DD');
                let end = moment(time).format('YYYY-MM-DD');
                let time1 = Date.parse(start) / 1000;
                let time2 = Date.parse(end) / 1000;
                let time_ = time1 - time2;
                let timecom = time_ / (3600 * 24);
                if (timecom <= 98) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        getList() {
            let url = '';
            if (this.name == '聚焦舆情') {
                url = '/api/v1/portal/focusing';
            } else {
                url = '/api/v1/portal/article';
            }
            if (this.name == '新闻中心') {
                this.params.size = 12;
            }
            axios
                .get(url, {
                    params: this.params
                })
                .then(res => {
                    this.list = res.data.data;
                    this.params.total = res.data.totalNumber;
                });
        },
        currentPage(pageNum) {
            //页面切换
            this.params.page = pageNum;
            this.getList();
        },
        routerTo(item) {
            this.$router.push({
                path: '/portal/list/newsList/1/' + item.articleId
            });
        }
    },
    filters: {
        formDate: function(data) {
            return moment(data).format('YYYY-MM-DD');
        },
        formTxt: function(txt, number) {
            return txt.length > number ? txt.slice(0, number) + '...' : txt;
        }
    },
    mounted() {
        this.params.page = parseInt(this.page);
        if (this.type == 'newsList') {
            this.showSquTips = '展示列表';
        }
        let xml = {
            newsList: '新闻中心',
            newsListToList: '新闻中心',
            leaderSpeech: '领导讲话',
            anno: '通知公告',
            outgoing: '集团发文',
            nstitution: 'nstitution',
            briefing: '工作简报',
            meetingTable: '公司会表',
            addressList: '通讯录',
            nstitution: '规章制度',
            partyActive: '党建活动',
            sociatyList: '工会活动',
            partyActive: 'partyBuilding',
            yq: '聚焦舆情'
        };
        this.name =
            xml[this.type] == 'partyBuilding' ? '党建活动' : xml[this.type];
        this.params['type'] = xml[this.type];
        this.getList();
    }
};
</script>

<style lang="scss" scoped>
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
            margin: 3px auto;
            p {
                margin: 0px;
                font-size: 13px;
            }
        }
    }
    .is-background {
        background: #fff;
        padding: 20px;
        clear: both;
    }
}
.portalList {
    width: 1200px;
    margin: 30px auto;
    .title {
        font-size: 36px;
        text-align: center;
        padding-bottom: 30px;
    }
    ul {
        border-radius: 5px;
        list-style-type: none;
        padding: 0px;
        margin: 0px;
        background: #fff;
        min-height: 700px;
        li {
            display: flex;
            padding: 20px;
            position: relative;
            align-items: center;
            font-size: 14px;
            font-weight: bold;
            border-bottom: 1px solid #dbdbdb;
            a {
                color: #000;
            }
            a:hover {
                color: #0066cc;
            }
        }
    }
    .newsList {
        padding: 0px;
        margin: 0px;
        // background: #fff;
        min-height: 800px;
        .list {
            float: left;
            width: 384px;
            border-radius: 5px;
            height: 340px;
            background: #fff;
            margin: 10px 7px;
            img {
                width: 100%;
                height: 220px;
            }
            h3 {
                // padding: 0px 5px;
                margin: 10px 10px;
            }
            p {
                margin: 5px 10px;
                line-height: 1.5;
            }
        }
        .list:hover {
            cursor: pointer;
        }
    }
}
</style>

