<template>
    <div id="app">
        <TopBar/>

        <div class="main">
            <div class="main-top">
                <div class="back" style="display:none;">
                    <el-button size="small" type="text" @click="back"><i class="el-icon-back el-icon--right"></i> 返回</el-button>
                </div>
            </div>
            <div class="main-container">
                <div class="content" :key="item.id" v-for="item in items" @click="preview(item)">
                    <el-row v-if="item.type!=undefined">
                        <el-col :span="20">
                            <router-link :to="'/portal/list/'+item.type+'/'+'1'+'/'+item.articleId" ><h4 class="title" style="color:#2C3E50">{{item.solrTitle}}</h4></router-link>
                        </el-col>
                        <el-col :span="4">
                            {{item.typeName}}
                        </el-col>
                    </el-row>
                    <h4 class="title" v-html="item.solrTitle" v-else></h4>
                    <div class="describe">{{item.solrContext}}</div>
                    <div class="info">发布于 {{item.solrCreateTime}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TopBar from "@/components/TopBar.vue";
    import axios from "axios";
    export default {
        data() {
            return {
                items: []
            }
        },
        components: {
            TopBar
        },
        // watch: {
        //     '$root.searchKey' () {
        //         this.doSearch(this.$root.searchKey);
        //     }
        // },
        methods: {
            preview(item){
                this.common.preview({url:item.solrFileAddress});
            },
            doSearch(key) {
                axios.get(`/solr/search?query=${encodeURI(key)}`).then(res => {
                    if(res.data!=[]){
                        this.items = res.data;
                    };
                    //领导讲话
                    axios.get(`/api/v1/portal/article?title=${encodeURI(key)}&type=领导讲话&size=10000&page=1`).then(res => {
                        // console.log(7788,res)
                        if(res.data.data!=[]){
                            let arr = res.data.data
                            for(let i = 0;i<arr.length;i++){
                                arr[i].type = "leaderSpeech";
                                arr[i].typeName = "领导讲话";
                                arr[i].solrTitle = arr[i].title;
                                arr[i].solrCreateTime = arr[i].time;
                            }
                            this.items = arr.concat(this.items);
                        };
                    });
                    //通知公告
                    axios.get(`/api/v1/portal/article?title=${encodeURI(key)}&type=通知公告&size=10000&page=1`).then(res => {
                        if(res.data.data!=[]){
                            let arr = res.data.data
                            for(let i = 0;i<arr.length;i++){
                                arr[i].type = "anno";
                                arr[i].typeName = "通知公告";
                                arr[i].solrTitle = arr[i].title;
                                arr[i].solrCreateTime = arr[i].time;
                            }
                            this.items = arr.concat(this.items);
                        };
                    });
                    //集团发文
                    axios.get(`/api/v1/portal/article?title=${encodeURI(key)}&type=集团发文&size=10000&page=1`).then(res => {
                        if(res.data.data!=[]){
                            let arr = res.data.data
                            for(let i = 0;i<arr.length;i++){
                                arr[i].type = "outgoing";
                                arr[i].typeName = "集团发文";
                                arr[i].solrTitle = arr[i].title;
                                arr[i].solrCreateTime = arr[i].time;
                            }
                            this.items = arr.concat(this.items);
                        };
                    });
                    //规章制度
                    axios.get(`/api/v1/portal/article?title=${encodeURI(key)}&type=规章制度&size=10000&page=1`).then(res => {
                        if(res.data.data!=[]){
                            let arr = res.data.data
                            for(let i = 0;i<arr.length;i++){
                                arr[i].type = "nstitution";
                                arr[i].typeName = "规章制度";
                                arr[i].solrTitle = arr[i].title;
                                arr[i].solrCreateTime = arr[i].time;
                            }
                            this.items = arr.concat(this.items);
                        };
                    });
                    //集团会表
                    axios.get(`/api/v1/portal/article?title=${encodeURI(key)}&type=集团会表&size=10000&page=1`).then(res => {
                        if(res.data.data!=[]){
                            let arr = res.data.data
                            for(let i = 0;i<arr.length;i++){
                                arr[i].type = "meetingTable";
                                arr[i].typeName = "集团会表";
                                arr[i].solrTitle = arr[i].title;
                                arr[i].solrCreateTime = arr[i].time;
                            }
                            this.items = arr.concat(this.items);
                        };
                    });
                    //工作简报
                    axios.get(`/api/v1/portal/article?title=${encodeURI(key)}&type=工作简报&size=10000&page=1`).then(res => {
                        if(res.data.data!=[]){
                            let arr = res.data.data
                            for(let i = 0;i<arr.length;i++){
                                arr[i].type = "briefing";
                                arr[i].typeName = "工作简报";
                                arr[i].solrTitle = arr[i].title;
                                arr[i].solrCreateTime = arr[i].time;
                            }
                            this.items = arr.concat(this.items);
                        };
                    });

                });
                // console.log(1125,this.items)
            },
            back() {
                this.$router.go(-1);
            }
        },
        mounted() {
            // console.log(1125,this.$route.params.key);
            this.doSearch(this.$route.params.key);
        }
    }
</script>

<style lang="scss" scoped>
    .main-top{
        background: #f4f4f4;
        border-bottom: 1px solid #eaeaea;
        .back{
            width:820px;
            margin:0 auto;
        }
    }
    .main-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding:0 30px;
        overflow: scroll;
        .content {
            border-bottom: 1px solid #ccc;
            padding: 10px 0;
            width: 1000px;
            margin:0 auto;
            cursor:pointer;
            .title {
                margin: 10px 0;
                font-size: 16px;
            }
            .describe {
                color: #aaa;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .info {
                display: flex;
                align-items: center;
                font-size: 13px;
            }
        }
    }
</style>
