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
                <h4 class="title" v-html="item.solrTitle"></h4>
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
    watch: {
        '$root.searchKey' () {
            this.doSearch(this.$root.searchKey);
        }
    },
    methods: {
        preview(item){
            this.common.preview({url:item.solrFileAddress});
        },
        doSearch(key) {
            axios.get(`/solr/search?query=${encodeURI(key)}`).then(res => {
                this.items = res.data;
            })
        },
        back() {
            this.$router.go(-1);
        }
    },
    mounted() {
        console.log(this.$route.params.key);
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
        max-width: 800px;
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
