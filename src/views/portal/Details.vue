<template>
  <div id="app">
    <TopBar/>
    <div class="portal">
        <div class="portalList">
            <div style="padding:15px 10px" v-if="type == 'newsList' || type =='newsListToList'"><router-link :to="{path:'/portal'}">首页</router-link> > <router-link :to="'/portal/list/newsListToList'+'/'+page">新闻中心</router-link></div>
             <div style="padding:15px 10px" v-if="type != 'newsList' && type !='newsListToList'"><router-link :to="{path:'/portal'}">首页</router-link> > <router-link :to="'/portal/list/'+type+'/'+ page">{{name}}</router-link></div>
            <div class="content">
                <!-- {{data.url[0]}} -->
                  <div class="title">
                        <h3>{{data.title}}</h3>
                        <p>发布时间：{{data.time}} &nbsp; &nbsp; 发布人：{{data.publisher}}  &nbsp; &nbsp;来源：{{data.source}}</p>
                  </div> 
                 <!-- <div v-if="pdfUrl" style="text-align:center"><PdfJs :pdfUrl="pdfUrl" /></div> -->
                 <div  style="text-align:center" v-if="pdfUrl">
                     <div style="width:100%;background:#FFF;height:60px; position:relative; z-index:999"></div>
                      <iframe width="100%" height="1000px" :src="pdfUrl" frameborder="0" style="margin-top:-52px;"></iframe>
                 </div>
                 <div v-html="data.content" class="newsContentDetails"></div>
                 <div style="text-align:left; padding:30px; border-top:1px solid #f1f1f1; margin-top:-50px;position:relative;z-index:9999;background:#FFF" v-if="data.url && data.url.length>0">
                    <div>附件：</div>
                    <br />
                    <div v-for="url of data.url" :key="url.type"  style="color:#0066cc;display:block;line-height:2; cursor:pointer; font-size:18px;">
                       <img src="@/assets/arrow2.png"  style="top:15px;"> &nbsp; <span @click="windowPreview(url.url)"> {{url.name}}</span> &nbsp; &nbsp; &nbsp;<a  :href="url.url" :download="url.name">下载</a>
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
import PdfJs from "./PdfJs";
export default {
    name: "apps",
    props: ["appname"],
    data() {
        return {
            pdfUrl: "",
            data: {},
            name: "",
        };
    },
    components: {
        TopBar,
        PdfJs,
    },
    props: ["type", "id","page"],
    watch: {},
    methods: {
        showPreview(url){          
            // if(!url.includes('/api/v1/files')){
            //     url = url.replace('/files/','/oldfiles/');
            // }
            this.common.preview(url);
        },
        windowPreview(url){
            this.openUrl = "http://static1.yxpe.com.cn/edit.html?";
                ntkoBrowser.openWindow(
                     this.openUrl +"removeBar=true" + "&&url=" + url
            );
              console.log( this.openUrl + "&url=" + url);
        }
    },
    filters: {
        formatTxt: function(txt) {
            return txt.split("/files/")[1];
        }
    },
    mounted() {
        let xml = {
            newsList: "新闻中心",
            leaderSpeech: "领导讲话",
            anno: "通知公告",
            outgoing: "集团发文",
            nstitution: "nstitution",
            briefing: "工作简报",
            meetingTable: "集团会表",
            addressList: "集团通讯录",
            nstitution: "规章制度",
            sociatyList:"工会活动",
            partyActive:"partyBuilding"
        };

        this.name = xml[this.type] == "partyBuilding" ? "党建活动" : xml[this.type];
        let params = {
            id: this.id
        };

        axios
            .get("/api/v1/portal/details", {
                params: params
            })
            .then(res => {
                let data = res.data.data;
                for (let i in data.url) {
                    if(typeof data.url[i] == 'string'){
                        let url = '',name = '',type = '';
                        if(!data.url[i].includes('/api/v1/files')){
                            url = data.url[i].replace('/files/','/oldfiles/');                           
                        }else{
                            url = data.url[i];
                        }
                        name = data.url[i].substring(data.url[i].lastIndexOf('/')+1,data.url[i].length);
                        type = data.url[i].substring(data.url[i].lastIndexOf('.')+1,data.url[i].length).toUpperCase();
                        data.url[i] = {url:url,name:name,type:type};
                    }
                    
         
                }
                if(data.text && JSON.parse(data.text).name){
                      //  this.pdfUrl =  "/op/view.aspx?src=http://work.zgcgroup.vpn" + JSON.parse(data.text).url;
                        this.pdfUrl = "http://static1.yxpe.com.cn/edit.html?removeBar=true&&url="+ JSON.parse(data.text).url;
                        data.url.push(JSON.parse(data.text));
                }else if(data.url.length>0){
                    if ('PDF,DOCX,PPTX,XLSX,DOC,XLS'.includes(data.url[0].type.toUpperCase())) {
                       // this.pdfUrl = "/op/view.aspx?src=http://work.zgcgroup.vpn" + data.url[0].url;
                        this.pdfUrl = "http://static1.yxpe.com.cn/edit.html?removeBar=true&&url=" + data.url[0].url;
                    }
                    // else if (''.includes(data.url[0].type)) {
                    //     // axios.get('/onlinePreview?url='+data.url[0].url).then(res => {
                    //     //     this.pdfUrl = res.data.match(/http.*\.pdf/)[0].replace('http://thumb1.zgcgroup.vpn:8012','/pdfproxy');
                    //     // });
                    //      this.pdfUrl = data.url[0];
                    // }
                }
                this.data = data;
            });
    }
};
</script>

<style lang="scss">
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
            margin: 0px auto;
            p{
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
        .newsContentDetails {
            padding: 0px 90px;
            text-align: left;
            font-size:18px;
            line-height:1.8em;
            img{
                display:block;
                margin:0 auto;
                max-width: 100%;
            }
        }
    }
    .title {
        h3 {
            padding:50px 20px 0px 20px;
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

