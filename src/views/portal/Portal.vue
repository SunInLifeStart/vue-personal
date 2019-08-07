<template>
    <div id="app">
        <TopBar/>
        <div class="portal">
            <div class="portal-container">
                <el-row>
                    <el-col :span="24">
                        <el-card shadow="always" class="news-carousel">
                            <div class="newsBaner">
                                <el-carousel height="200px" :interval="6000" indicator-position="outside">
                                    <el-carousel-item v-for="item in newsList" :key="item.articleId">
                                        <router-link :to="{path:'/portal/list/newsList/1/'+item.articleId}">
                                            <img :src="item.img[0]" width="100%" height="100%" />
                                            <div class="scrollImgTitle" :title="item.title">{{item.title}}</div>
                                        </router-link>
                                    </el-carousel-item>
                                </el-carousel>
                            </div>
                            <div class="newsContent">
                                <div v-for="(item,index) in newsListRight" :key="item.articleId" v-if="index < 5">
                                    <h4 style="margin:0px;font-weight:normal;border-bottom: 1px solid #f9f8f8;">
                                        <router-link :to="{path:'/portal/list/newsList/1/'+item.articleId}">
                                            <span style="color: rgb(52, 136, 234);"> •</span> {{item.title | formTxtTitle}}
                                            <span style="float:right;display:inline-block">{{item.time | formDate}}</span>
                                        </router-link>
                                    </h4>
                                </div>
                                <div style="float:right">
                                    <router-link :to="{path:'/portal/list/newsList/1'}">
                                        <el-button size="mini">更多</el-button>
                                    </router-link>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row class="counts">
                    <el-col :span="4">
                        <span class="number">
                            <countTo :startVal='0' :endVal='totalAssets' :duration='1000' :decimals="2"></countTo>
                            <label class="unit">亿</label>
                        </span>
                        <p>总投资额</p>
                    </el-col>
                    <el-col :span="5">
                        <span class="number">
                            <countTo :startVal='0' :endVal='fundedProjects' :duration='1000' :decimals="1"></countTo>
                            <label class="unit">亩</label>
                        </span>
                        <p>土地出让</p>
                    </el-col>
                    <el-col :span="5">
                        <span class="number">
                            <countTo :startVal='0' :endVal='serviceFirm' :duration='1000'></countTo>
                            <label class="unit">个</label>
                        </span>
                        <p>签约项目</p>
                    </el-col>
                    <el-col :span="5">
                        <span class="number">
                            <countTo :startVal='0' :endVal='construction' :duration='1000' :decimals="1"></countTo>
                            <label class="unit">亿</label>
                        </span>
                        <p>投产后年产值</p>
                    </el-col>
                    <el-col :span="5">
                        <span class="number">
                            <countTo :startVal='0' :endVal='nianchan' :duration='1000' :decimals="1"></countTo>
                            <label class="unit">亿</label>
                        </span>
                        <p>年产税收</p>
                    </el-col>
                </el-row>
                <el-row class="articles" :gutter="15">
                    <el-col :span="8">
                        <!-- <div class="article">
                  <h3>通知公告<router-link :to="{path:'/portal/list/leaderSpeech/1'}"><el-button size="mini">更多</el-button></router-link></h3>
                  <ul>
                    <li v-for="(item,index) in leaderSpeech" :key="item.articleId">
                     <img src="@/assets/leader3.png" align="middle" v-if="index == 0"> 
                     <img src="@/assets/leader1.png" align="middle" v-if="index != 0"> 
                      <router-link :to="'/portal/list/leaderSpeech/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                      <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                    </li>
                  </ul>
              </div> -->
                        <div class="article">
                            <h3>通知公告
                                <router-link :to="{path:'/portal/list/anno/1'}">
                                    <el-button size="mini">更多</el-button>
                                </router-link>
                            </h3>
                            <ul>
                                <li v-for="(item,index) in anno" :key="item.articleId" style="padding-left:10px;">
                                    <span style="color: #ea3476;" v-if="index == 0"> •</span>
                                    <span style="color: #3488ea;" v-if="index != 0"> •</span>
                                    <router-link :to="'/portal/list/anno/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                                    <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="article">
                            <h3>公司发文
                                <router-link :to="{path:'/portal/list/outgoing/1'}">
                                    <el-button size="mini">更多</el-button>
                                </router-link>
                            </h3>
                            <ul>
                                <li v-for="(item,index) in outgoing" :key="item.articleId" style="padding-left:10px;">
                                    <span style="color: #ea3476;" v-if="index == 0"> •</span>
                                    <span style="color: #3488ea;" v-if="index != 0"> •</span>
                                    <router-link :to="'/portal/list/outgoing/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                                    <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="article">
                            <h3>通讯录/会表
                                <router-link :to="{path:'/portal/list/addressList/1'}">
                                    <el-button size="mini">更多</el-button>
                                </router-link>
                            </h3>
                            <ul>
                                <li v-for="(item,index) in addressList" :key="item.articleId" style="padding-left:20px; height:40px;line-height:40px">
                                    <img src="@/assets/phone2.png" v-if="index == 0" style="top:12px;">
                                    <img src="@/assets/phone.png" v-if="index != 0" style="top:12px;">
                                    <router-link :to="'/portal/list/addressList/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                                    <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="articles" :gutter="15">
                    <el-col :span="8">
                        <div class="article article2">
                            <h3>督办上墙
                                <router-link :to="{path:'/portal/list/duban/1'}">
                                    <!--<el-button size="mini">更多</el-button>-->
                                </router-link>
                            </h3>
                            <ul>
                                <li v-for="(item,index) in duban" :key="item.id" style="padding-left:18px; height:40px;line-height:40px">
                                    <img src="@/assets/arrow.png" v-if="index == 0" style="top:15px;">
                                    <img src="@/assets/arrow2.png" v-if="index != 0" style="top:15px;">
                                    <router-link :to="'/portal/list/duban/1/' + item.id" :title="item.title"> {{item.title | formTxt}}</router-link>
                                    <span style="float:right;margin-right:10px;">{{item.created | formDate}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <el-row>
                            <!-- <router-link :to="{path:'/portal/list2'}"><img class="dang" src="@/assets/dang.jpg"></router-link> -->
                            <div class="article article2">
                                <h3>规章制度
                                    <router-link :to="{path:'/portal/list/nstitution/1'}">
                                        <el-button size="mini">更多</el-button>
                                    </router-link>
                                </h3>
                                <ul>
                                    <li v-for="(item,index) in nstitution" :key="item.articleId" style="padding-left:18px; height:40px;line-height:40px">
                                        <img src="@/assets/arrow.png" v-if="index == 0" style="top:15px;">
                                        <img src="@/assets/arrow2.png" v-if="index != 0" style="top:15px;">
                                        <router-link :to="'/portal/list/nstitution/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                                        <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                                    </li>
                                </ul>
                            </div>
                        </el-row>
                    </el-col>
                    <el-col :span="8">
                        <div class="article article2">
                            <h3>最新文档
                                <router-link :to="{path:'/docs'}">
                                    <el-button size="mini">更多</el-button>
                                </router-link>
                            </h3>
                            <ul>
                                <li v-for="(item,index) in newDocs" :key="item.articleId" style="padding-left:18px; height:40px;line-height:40px" @click="showDocs(item)">
                                    <img src="@/assets/arrow.png" v-if="index == 0" style="top:15px;">
                                    <img src="@/assets/arrow2.png" v-if="index != 0" style="top:15px;"> {{item.name | formTxt}}
                                    <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>

                <!-- <el-row class="articles" :gutter="15">
          <el-col :span="12">
           <div class="article wendang">
                  <h3>最新文档<router-link :to="{path:'/docs'}"><el-button size="mini">更多</el-button></router-link></h3>
                  
                    <li v-for="(item,index) in newDocs"  :key="item.id" class="newdocs" @click="showDocs(item)">
                       <div style="position:absolute;width:74px;height:94px;left:10px;top:20px;border:1px solid #dcdada">  
                            <img :src="item.iconUrl"  width="74px" height="94px"/>
                        </div>
                      <div>{{item.name}}</div>  
                      <div style="font-size:13px;line-height:24px;">{{item.created | formDate}}</div>
                    </li>
                 
              </div>
          </el-col>
          <el-col :span="12">
            <div class="article yuqing">
                  <h3>聚焦舆情<router-link :to="{path:'/portal/list/yq/1'}"><el-button size="mini">更多</el-button></router-link></h3>
                  <ul>
                    <li v-for="(item,index) in yq" :key="item.articleId" style="padding-left:10px; height:50px;line-height:50px">
                        <a :href="item.url" target="_blank" :title="item.title">{{item.title}}</a>  
                    </li>
                  </ul>
              </div>           
          </el-col>
        </el-row> -->
            </div>
            <div class="footer">
                <div class="contennt">
                    <img src="@/assets/footerlogo.png" width="228px" />
                    <div style="float:right">
                        <p>运维电话：010-80456818</p>
                        <p>Copyright 2019 DHC software Co. Ltd.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar.vue';
import countTo from 'vue-count-to';
import axios from 'axios';
import moment from 'moment';
import cookies from 'js-cookie';
export default {
    name: 'apps',
    props: ['appname'],
    data() {
        return {
            startVal: 0,
            totalAssets: 15.84,
            fundedProjects: 537.2,
            serviceFirm: 17,
            construction: 64.8,
            nianchan: 2.4,
            newsList: [],
            leaderSpeech: [],
            anno: [],
            outgoing: [],
            nstitution: [],
            briefing: [],
            meetingTable: [],
            addressList: [],
            newDocs: [],
            yq: [],
            newsListRight: [],
            inspectParams: {
                page: 1,
                pageSize: 10000,
                orderBy: 'created',
                desc: true,
                options: [{ field: 'status', filter: 'LIKE', value: '04' }],
                uid: parseInt(cookies.get('uid'))
            },
            duban: []
        };
    },
    components: {
        TopBar,
        countTo
    },
    watch: {},
    methods: {
        // showDocs(item){
        //     this.common.preview(item);
        // },
        showDocs(item) {
            if ('DOCX,PPTX,XLSX,DOC,XLS'.includes(item.type.toUpperCase())) {
                this.openUrl = 'http://static1.yxpe.com.cn/edit.html?';
                ntkoBrowser.openWindow(
                    this.openUrl + 'removeBar=true' + '&&url=' + item.url
                );
            } else {
                this.common.preview(item);
            }
        },
        getInspect() {
            axios
                .post('/api/v1/inspect_forms/query', this.inspectParams)
                .then(response => {
                    this.duban = response.data.forms;
                });
        },
        getMsgList() {
            let self = this;
            axios.get('/api/v1/portal/statistics').then(res => {
                if (res.data.data) {
                    /** 
                    self.totalAssets = parseInt(res.data.data.totalAssets);
                    self.fundedProjects = parseInt(
                        res.data.data.fundedProjects
                    );
                    self.serviceFirm = parseInt(res.data.data.serviceFirm);
                    self.construction = parseInt(res.data.data.construction);
                    */
                }
            });

            let type = [
                '新闻中心',
                '领导讲话',
                '通知公告',
                '集团发文',
                '规章制度',
                '工作简报',
                '集团会表',
                '通讯录'
            ];
            for (let item of type) {
                let params;
                if (item === '新闻中心') {
                    params = {
                        type: item,
                        page: 1,
                        putaway: true,
                        size: item == '规章制度' || item == '新闻中心' ? 10 : 5
                    };
                } else {
                    params = {
                        type: item,
                        page: 1,
                        size: item == '规章制度' || item == '新闻中心' ? 10 : 5
                    };
                }
                axios
                    .get('/api/v1/portal/article', {
                        params: params
                    })
                    .then(res => {
                        switch (item) {
                            case '新闻中心':
                                // this.newsList = res.data.data;
                                let arr_5 = [];
                                for (var i = 0; i < res.data.data.length; i++) {
                                    if (res.data.data[i].img.length > 0) {
                                        arr_5.push(res.data.data[i]);
                                    }
                                }
                                this.newsListRight = res.data.data;
                                this.newsList = arr_5.slice(0, 5);
                                console.log(this.newsListRight);
                                break;
                            case '领导讲话':
                                this.leaderSpeech = res.data.data;
                                break;
                            case '通知公告':
                                this.anno = res.data.data;
                                break;
                            case '集团发文':
                                this.outgoing = res.data.data;
                                break;
                            case '规章制度':
                                this.nstitution = res.data.data;
                                break;
                            case '工作简报':
                                this.briefing = res.data.data;
                                break;
                            case '集团会表':
                                this.meetingTable = res.data.data;
                                break;
                            case '通讯录':
                                this.addressList = res.data.data;
                                break;
                            default:
                        }
                    });
            }
        },
        getNewDocs() {
            let self = this;
            axios
                .post('/api/v1/share/list', {
                    page: 1,
                    pageSize: 35,
                    desc: true,
                    orderBy: 'created',
                    options: [{ field: 'tags', filter: 'LIKE', value: '' }]
                })
                .then(res => {
                    self.newDocs = res.data.forms.splice(0, 4);
                });

            axios.get('/api/v1/portal/focusing').then(res => {
                self.yq = res.data.data.splice(0, 13);
            });
        }
    },
    filters: {
        formDate: function(date) {
            return date ? date.replace(/(^\s*)|(\s*$)/g, '').split(' ')[0] : '';
        },
        formTxtTitle: function(txt) {
            return txt.length > 48 ? txt.slice(0, 48) + '...' : txt;
        },
        formTxt: function(txt) {
            return txt.length > 18 ? txt.slice(0, 18) + '...' : txt;
        }
    },
    mounted() {
        document.title = '公司门户-中关村协同发展';
        this.getMsgList();
        this.getNewDocs();
        this.getInspect();
    }
};
</script>

<style lang="scss" scoped>
#app {
    overflow: auto;
}
.portal {
    background: #f6f6f6 url('../../assets/portal.png') no-repeat center;
    background-position-y: 0px;
    background-size: 100%;

    .portal-container {
        ul {
            margin: 0px;
            padding: 0px;
            list-style: none;
        }
        width: 1200px;
        margin: 30px auto;
        .news-carousel {
            height: 245px;
            color: #2c3e50;
            .newsBaner {
                width: 350px;
                height: 200px;
                float: left;
                //  .el-carousel__indicators .el-carousel__indicator button{
                //        width: 22px;
                //  }
                .scrollImgTitle {
                    position: absolute;
                    background: #ccc;
                    bottom: 0px;
                    width: 100%;
                    height: 20px;
                    padding: 3px 5px;
                    line-height: 1.7;
                    //   background: rgba(31,140,222,0.6);
                    background: rgba(0, 0, 0, 0.5);
                    color: #fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 12px;
                    letter-spacing: 1px;
                }
            }
            .newsContent {
                width: 775px;
                float: left;
                margin-left: 30px;
                h3 {
                    margin: 0px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    line-height: 45px;
                    height: 45px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 20px;
                }
                a {
                    padding: 9px;
                    display: inline-block;
                    width: 100%;
                    color: #2c3e50;
                }
                a:hover {
                    color: #0066cc;
                }
                a:visited {
                    color: normal;
                }
                p {
                    margin: 5px;
                    text-indent: 2em;
                    font-size: 16px;
                    line-height: 1.8em;
                    height: 125px;
                    overflow: hidden;
                    a {
                        color: #2c3e50;
                    }
                }
            }
        }
        .counts {
            color: #fff;
            // height: 100px;
            // line-height: 100px;
            padding: 15px 0px;
            text-align: center;
            .number {
                font-size: 40px;
                font-family: 'helveticaneuethn, Arial';
                font-weight: 200;
                .unit {
                    position: relative;
                    bottom: 20px;
                    right: 10px;
                    font-size: 13px;
                    font-weight: 300;
                }
            }
            p {
                margin: 0px;
            }
        }
        .articles {
            margin-bottom: 16px;
            .article {
                background: #fff;
                border-radius: 5px;
                padding: 0px 10px;
                a {
                    color: #2c3e50;
                }
                a:hover {
                    color: #0066cc;
                }
                h3 {
                    margin: 0px;
                    padding: 13px 10px;
                    button {
                        float: right;
                        padding: 4px 6px;
                    }
                }
                ul {
                    li {
                        position: relative;
                        border-top: 1px solid #dee2e6;
                        line-height: 42px;
                        height: 42px;
                        padding-left: 33px;
                        font-size: 12px;
                        img {
                            position: absolute;
                            top: 8px;
                            left: 3px;
                        }
                    }
                    li:hover {
                        color: #0066cc;
                        cursor: pointer;
                    }
                }
                height: 260px;
            }
            .article2 {
                height: 460px;
            }
            .dang {
                margin-bottom: 10px;
            }
            .jianbao {
                height: 285px;
            }
            .huibiao {
                height: 110px;
                margin-bottom: 10px;
            }
            .tongxun {
                height: 336px;
            }
            .wendang {
                height: 590px;
                .newdocs {
                    padding: 30px 0px 65px 100px;
                    position: relative;
                    border-top: 1px solid #dee2e6;
                    list-style: none;
                    cursor: pointer;
                }
            }
            .yuqing {
                height: 590px;
            }
        }
    }
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
</style>

