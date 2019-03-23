<template>
  <div id="app">
    <TopBar/>
    <div class="portal">
      <div class="portal-container">
        <el-row>
          <el-col :span="24">
            <el-card shadow="always" class="news-carousel">
              <el-carousel :interval="3000" arrow="always">
                <el-carousel-item v-for="item in newsList" :key="item.articleId" @click="routerTo(item)">
                  <div style="padding:0px 80px">
                    <div class="newsBaner">
                        <img :src="item.img[0]" width="100%" height="100%">
                    </div>
                    <div class="newsContent">
                        <h3>{{item.title}}</h3>
                         <p><router-link :to="{path:'/portal/list/newsList/1/'+item.articleId}">{{item.about}} &nbsp;&nbsp;&nbsp; <span style="color:#0066cc">详情..</span></router-link></p>
                         <div><router-link :to="{path:'/portal/list/newsList/1'}"><el-button size="mini">更多</el-button></router-link></div>
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="counts">
          <el-col :span="6">
            <span class="number">
               <countTo :startVal='0' :endVal='totalAssets' :duration='1000'></countTo>
               <label class="unit">亿</label>
            </span>
            <p>总投资额</p>
          </el-col>
          <el-col :span="6">
           <span class="number">
               <countTo :startVal='0' :endVal='fundedProjects' :duration='1000'></countTo>
              <label class="unit">家</label>
            </span>
             <p>企业落地数量</p>
          </el-col>
          <el-col :span="6">
           <span class="number">
               <countTo :startVal='0' :endVal='serviceFirm' :duration='1000'></countTo>
                <label class="unit">千万</label>
            </span>
              <p>年税收额</p>
          </el-col>
          <el-col :span="6">
            <span class="number">
               <countTo :startVal='0' :endVal='construction' :duration='1000'></countTo>
                <label class="unit">家</label>
            </span>
              <p>企业动工数量</p>
          </el-col>
        </el-row>
        <el-row class="articles" :gutter="15">
          <el-col :span="8">
              <div class="article">
                  <h3>通知公告<router-link :to="{path:'/portal/list/leaderSpeech/1'}"><el-button size="mini">更多</el-button></router-link></h3>
                  <ul>
                    <li v-for="(item,index) in leaderSpeech" :key="item.articleId">
                     <img src="@/assets/leader3.png" align="middle" v-if="index == 0"> 
                     <img src="@/assets/leader1.png" align="middle" v-if="index != 0"> 
                      <router-link :to="'/portal/list/leaderSpeech/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                      <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                    </li>
                  </ul>
              </div>
            
          </el-col>
          <el-col :span="8">
              <div class="article">
                  <h3>公司发文<router-link :to="{path:'/portal/list/anno/1'}"><el-button size="mini">更多</el-button></router-link></h3>
                  <ul>
                    <li v-for="(item,index) in anno" :key="item.articleId" style="padding-left:10px;">
                    <span style="color: #ea3476;"  v-if="index == 0"> •</span>
                    <span style="color: #3488ea;"  v-if="index != 0"> •</span>
                    <router-link :to="'/portal/list/anno/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                      <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                    </li>
                  </ul>
              </div>
          </el-col>
          <el-col :span="8">
             <div class="article">
                  <h3>通讯录/会表<router-link :to="{path:'/portal/list/outgoing/1'}"><el-button size="mini">更多</el-button></router-link></h3>
                  <ul>
                    <li v-for="(item,index) in outgoing" :key="item.articleId" style="padding-left:10px;">
                    <span style="color: #ea3476;"  v-if="index == 0"> •</span>
                    <span style="color: #3488ea;"  v-if="index != 0"> •</span>
                     <router-link :to="'/portal/list/outgoing/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                      <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                    </li>
                  </ul>
              </div>
          </el-col>
        </el-row>
        <el-row class="articles" :gutter="15">
          <el-col :span="8">
             <div class="article article2">
                  <h3>督办上墙<router-link :to="{path:'/portal/list/nstitution/1'}"><el-button size="mini">更多</el-button></router-link></h3>
                  <ul>
                    <li v-for="(item,index) in nstitution" :key="item.articleId" style="padding-left:18px; height:40px;line-height:40px">
                       <img src="@/assets/arrow.png"  v-if="index == 0" style="top:15px;"> 
                       <img src="@/assets/arrow2.png"  v-if="index != 0" style="top:15px;"> 
                       <router-link :to="'/portal/list/nstitution/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                      <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                    </li>
                  </ul>
              </div>
          </el-col>
          <el-col :span="8">
            <el-row>
              <!-- <router-link :to="{path:'/portal/list2'}"><img class="dang" src="@/assets/dang.jpg"></router-link> -->
              <div class="article article2">
                  <h3>规章制度<router-link :to="{path:'/portal/list/briefing/1'}"><el-button size="mini">更多</el-button></router-link></h3>
                  <ul>
                    <li v-for="(item,index) in briefing" :key="item.articleId" style="padding-left:35px; height:40px;line-height:40px">
                      <img src="@/assets/briefing.png"  v-if="index != 0"> 
                      <img src="@/assets/briefing2.png"  v-if="index == 0"> 
                      <router-link :to="'/portal/list/briefing/1/' + item.articleId" :title="item.title"> {{item.title | formTxt}}</router-link>
                      <span style="float:right;margin-right:10px;">{{item.time | formDate}}</span>
                    </li>
                  </ul>
              </div>
            </el-row>            
          </el-col>
            <el-col :span="8">
             <div class="article article2">
                  <h3>最新文档<router-link :to="{path:'/docs'}"><el-button size="mini">更多</el-button></router-link></h3>
                  <ul>
                    <li v-for="(item,index) in newDocs" :key="item.articleId" style="padding-left:18px; height:40px;line-height:40px"  @click="showDocs(item)">
                       <img src="@/assets/arrow.png"  v-if="index == 0" style="top:15px;"> 
                       <img src="@/assets/arrow2.png"  v-if="index != 0" style="top:15px;"> 
                       {{item.name | formTxt}}
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
                  <p>运维电话：18510862905运维邮箱：18510862905@163.com</p>
                  <p>Copyright  2019 DHC software Co. Ltd.</p>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import countTo from "vue-count-to";
import axios from "axios";
import moment from "moment";
export default {
    name: "apps",
    props: ["appname"],
    data() {
        return {
            startVal: 0,
            totalAssets:0,
            fundedProjects: 0,
            serviceFirm:0,
            construction: 0,
            newsList: [],
            leaderSpeech:[],
            anno: [],
            outgoing:[],
            nstitution:[],
            briefing:[],
            meetingTable:[],
            addressList:[],
            newDocs:[],
            yq:[]
        };
    },
    components: {
        TopBar,
        countTo
    },
    watch: {},
    methods: {
        showDocs(item){
            this.common.preview(item);
        },
        getMsgList() {
            let self = this;
            axios
                    .get("/api/v1/portal/statistics")
                    .then(res => {
                        self.totalAssets = parseInt( res.data.data.totalAssets);
                        self.fundedProjects = parseInt(res.data.data.fundedProjects) ;
                        self.serviceFirm = parseInt(res.data.data.serviceFirm) ;
                        self.construction = parseInt(res.data.data.construction);
                    });


            let type = [
                "新闻中心",
                "领导讲话",
                "通知公告",
                "集团发文",
                "规章制度",
                "工作简报",
                "集团会表",
                "通讯录"
            ];

            for (let item of type) {
              
                let params = {
                   type: item,
                    page: 1,
                    size: item == "规章制度" ? 10 : 5
                }
                axios
                    .get("/api/v1/portal/article", {
                        params: params
                    })
                    .then(res => {
                        switch (item) {
                            case "新闻中心":
                                this.newsList = res.data.data;
                                break;
                            case "领导讲话":
                                this.leaderSpeech = res.data.data;
                                break;
                            case "通知公告":
                                this.anno = res.data.data;
                                break;
                            case "集团发文":
                                this.outgoing = res.data.data;
                                break;
                            case "规章制度":
                                this.nstitution = res.data.data;
                                break;
                            case "工作简报":
                                this.briefing = res.data.data;
                                break;
                            case "集团会表":
                                this.meetingTable = res.data.data;
                                break;
                              case "通讯录":
                                this.addressList  = res.data.data;
                                break;
                            default:
                        }
                    });
            }
        },
        getNewDocs(){
                let self = this;
                 axios
                    .post("/api/v1/share/list",{"page":1,"pageSize":35,"desc":true,"orderBy":"created","options":[{"field":"tags","filter":"LIKE","value":""}]})
                    .then(res => {  
                        self.newDocs = res.data.forms.splice(0,4);
                    })

                 axios
                    .get("/api/v1/portal/focusing")
                    .then(res => {  
                         self.yq = res.data.data.splice(0,13);
                    })
      

        }
    },
    filters: {
        formDate: function(date) {
            return  date ?  date.replace(/(^\s*)|(\s*$)/g, "").split(" ")[0] : "";
          
           
          // return moment(date).format("YYYY-MM-DD");
        },
        formTxt: function(txt) {
            return txt.length > 18 ? txt.slice(0, 18) + "..." : txt;
        }
    },
    mounted() {
        document.title = "集团门户-中关村协同发展";
        this.getMsgList();
        this.getNewDocs();
    }
};
</script>

<style lang="scss" scoped>
#app {
    overflow: auto;
}
.portal {
    background: #f6f6f6 url("../../assets/portal.png") no-repeat center;
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
            .newsBaner{
                width: 350px;
                height: 200px;
                float: left;
            }
            .newsContent{
                width: 615px;
                float: left;
                margin-left: 30px;
                h3{
                    margin: 0px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                    line-height: 45px;
                    height:45px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    font-size:20px;
                }
                p{
                     margin:5px;
                     text-indent:2em; 
                     font-size:16px;
                     line-height:1.8em;
                     height:125px;
                     overflow: hidden;
                     a{
                        color:#2c3e50
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
                font-family: "helveticaneuethn, Arial";
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
                a{
                    color: #2c3e50
                }
                 a:hover{
                    color: #0066cc
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
                .newdocs{
                padding:30px 0px 65px 100px;
                 position:relative;
                 border-top:1px solid #dee2e6;
                 list-style:none;
                 cursor: pointer;
                }
               
            }
            .yuqing {
                height: 590px;
            }
        }
    }
    .footer{
        padding: 40px;
        background: #FFF;
        .contennt{
            width: 1200px;
            margin: 0px auto;
            p{
                margin: 3px;
                font-size: 13px;
            }
        }
    }
}
</style>

