<template>
  <div id="app">
    <TopBar/>
    <div class="portal">
        <div class="portalList">
            <div style="padding:15px 10px"><router-link :to="{path:'/portal'}">首页</router-link> > 工会以及党建活动</div>

                <div style="background:#FFF">
                     <div  class="newsList" style="min-height:340px">
                            <h3>党建活动  <router-link :to="{path:'/portal/list/partyActive/1'}" style="float:right"><el-button size="mini">更多</el-button></router-link></h3>
                            <div class="list" v-for="(item,index) of partyList" :key="item.articleId"  @click="routerTo(item,'partyActive')" v-if="index<3">
                                <div><img :src="item.img"></div>
                                <h5>{{item.title | formTxt(20)}}</h5>
                            </div>
                    </div>
                </div>
                <div style="background:#FFF;margin-top:30px;">
                     <div  class="newsList" style="min-height:340px">
                            <h3>工会活动  <router-link :to="{path:'/portal/list/sociatyList/1'}" style="float:right"><el-button size="mini">更多</el-button></router-link></h3>
                            <div class="list" v-for="(item,index) of sociatyList" :key="item.articleId"  @click="routerTo(item,'sociatyList')" v-if="index<3">
                                <div><img :src="item.img"></div>
                                <h5>{{item.title | formTxt(20)}}</h5>
                            </div>
                    </div>
                </div>
                <div style="background:#FFF;margin-top:30px;">
                     <div  class="newsList" style="min-height:340px">
                            <h3>投票活动  <el-button size="mini" style="float:right">更多</el-button></h3>
                            <div class="list">
                                <div><img src="@/assets/tp1.png" /></div>
                            </div>
                            <div class="list">
                                <div><img src="@/assets/tp2.png" /></div>
                            </div>
                            <div class="list">
                                <div><img src="@/assets/tp3.png" /></div>
                            </div>
                    </div>
                </div>
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
import axios from "axios";
import moment from "moment";
export default {
    name: "apps",
    props: ["appname"],
    data() {
        return {
            partyList: [],
            sociatyList:[],
            name: ""
        };
    },
    components: {
        TopBar
    },
    props: ["type"],
    watch: {},
    methods: {
        routerTo(item,type){
            this.$router.push({
                 path: '/portal/list/'+type+'/1/'+item.articleId,
        })
         }
    },
    filters: {
        formDate: function(data) {
            return moment(data).format("YYYY-MM-DD");
        },
        formTxt: function(txt,number) {
            return txt.length > number ? txt.slice(0, number) + "..." : txt;
        }
    },
    mounted() {
          let type = [
              "partyBuilding",
             "工会活动",
        ];

         for (let item of type) {
                let params = {
                    type: item,
                    page: 1,
                    size: 5
                }
                axios
                    .get("/api/v1/portal/article", {
                        params: params
                    })
                    .then(res => {
                        switch (item) {
                            case "partyBuilding":
                                this.partyList = res.data.data;
                                break;
                            case "工会活动":
                                this.sociatyList = res.data.data;
                                break;
                        }
                    });
            }
    }
};
</script>

<style lang="scss" scoped>
#app {
    overflow: auto;
}
.portal {
    background: #f0f0f0;
      .footer{
        padding: 40px;
        background: #FFF;
        .contennt{
            width: 1200px;
            margin: 3px auto;
            p{
                margin: 0px;
                font-size: 13px;
            }
        }
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
    // ul {
    //     border-radius: 5px;
    //     list-style-type: none;
    //     padding: 0px;
    //     margin: 0px;
    //     background: #fff;
    //     min-height: 360px;
    //     li {
    //         display: flex;
    //         padding: 20px;
    //         align-items: center;
    //         font-size: 14px;
    //         font-weight: bold;
    //         border-bottom: 1px solid #dbdbdb;
    //         a {
    //             color: #000;
    //         }
    //         a:hover {
    //             color: #0066cc;
    //         }
    //     }
    // }
    .newsList {
        padding: 0px;
        margin: 0px;
        overflow: hidden;
        h3{
            padding: 0px 20px;
        }
        .list{
            float: left;
            width: 384px;
            border-radius: 5px;
            height: 260px;
            background: #FFF;
            margin: 10px 7px;
            img{
                width: 100%;
                height: 220px;
            }
            h5{
                 margin: 10px 10px;
                 font-size:14px;
            }
            p{
                margin: 5px 10px;
                line-height: 1.5;
            }
        }
        .list:hover{
            cursor: pointer; 
        }
    }
}
</style>

