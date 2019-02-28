<template>
    <el-popover placement="bottom-start" width="360" height="500" class="drawer">
        <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
            <el-tab-pane label="通知公告" name="first">
                <div class="items">
                    <div class="item" style="cursor:pointer;text-align:left" @click="openContent(item)" :key="item.id" v-for="item in items">
                        <div class="content" style="line-height:30px;">
                            <div class="title">{{item.title}}</div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="icon" slot="reference">
            <el-badge :value="getNewMessage" :hidden="getNewMessage<1000" class="item">
                <i class="iconfont el-icon-bell" size="18" />
            </el-badge>
        </div>
    </el-popover>
</template>

<script>
import { mapGetters } from "vuex";
import ClickOutside from "@/directives/clickoutside";
import axios from "axios";
export default {
    name: "notice",
    data() {
        return {
            items: [],
            showNotice: false,
            activeName: "first",
            items: []
        };
    },
    directives: {
        ClickOutside
    },
    computed: {
        ...mapGetters(["getNewMessage"])
    },

    methods: {
        getMessages() {
            axios.get(`/api/v1/portal/noticeBulletin`).then(res => {
                this.items = res.data.data;
            });
        },
        openContent(item) {
            window.open('http://zgcgroup.vpn/noticeBulletin/details?type=%E9%80%9A%E7%9F%A5%E5%85%AC%E5%91%8A&id='+item.articleId);
        },
        aaa() {
            this.showNotice = false;
        },
        handleClick() {},
        openMessage() {
            this.showNotice = true;
            this.$store.dispatch("addMessage", 0);
        }
    },
    mounted() {
        this.getMessages();
    }
};
</script>

<style lang="scss" scoped>
.notice {
    background: #fff;
    position: absolute;
    display: block;
    top: 48px;
    right: 0;
    bottom: 0;
    width: 350px;
    box-shadow: rgba(0, 0, 0, 0.2) -30px 0px 30px -30px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    z-index: 9999;
    overflow: scroll;
    .panel {
        padding: 0 23px;
    }
}

.items {
    .item {
        padding-left: 16px;
        padding-right: 16px;
        .avatar {
            width: 36px;
        }
        .title {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>
