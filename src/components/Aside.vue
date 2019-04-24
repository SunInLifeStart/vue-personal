<template>
    <div class="aside">
        <div class="aside-top">
            <i class="icon iconfont el-icon-liaotian" size="18"  v-if="msg" />
            <router-link to="/publicforum">
                <!-- <i class="icon iconfont el-icon-youjian" /> -->
            </router-link>
            <router-link to="/webim">
                <i class="icon iconfont el-icon-qunzu" />
            </router-link>
        </div>
        <div class="aside-container">
            <div class="collapse">
                <div class="title">
                    <i class="icon el-icon-arrow-down" /><span class="title-name">工作</span>
                </div>
                <div class="content">
                    <router-link to="/home/todo">
                        <div class="item" :class="{active:$route.params.type=='todo'}">
                            <i class="icon iconfont el-icon-daiban" /><span>待办 &nbsp;</span><span v-if="todoListLength">({{todoListLength}})</span>
                        </div>
                    </router-link>
                    <router-link to="/home/done">
                        <div class="item" :class="{active:$route.params.type=='done'}">
                            <i class="icon iconfont el-icon-yiban" /><span>已办</span>
                        </div>
                    </router-link>
                    <router-link to="/home/reading">
                        <div class="item" :class="{active:$route.params.type=='reading'}">
                            <i class="icon iconfont el-icon-caogao" /><span>待阅 &nbsp;</span><span v-if="todoListLength">({{readingListLength}})</span>
                        </div>
                    </router-link>
                </div>
            </div>
            <div class="collapse">
                <div class="title">
                    <i class="icon el-icon-arrow-down" /><span class="title-name">云盘</span>
                </div>
                <div class="content">
                    <router-link to="/filestore/doc">
                        <div class="item" :class="{active:$route.params.type=='doc'}">
                            <i class="icon iconfont el-icon-wendang" /><span>文档</span>
                        </div>
                    </router-link>
                    <router-link to="/filestore/pic">
                        <div class="item" :class="{active:$route.params.type=='pic'}">
                            <i class="icon iconfont el-icon-pic" /><span>图片</span>
                        </div>
                    </router-link>
                    <router-link to="/filestore/mov">
                        <div class="item" :class="{active:$route.params.type=='mov'}">
                            <i class="icon iconfont el-icon-shipin" /><span>视频</span>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="aside-bottom" v-if="false">
            <i class="icon iconfont el-icon-youjian" />
            <i class="icon iconfont el-icon-rili" />
            <i class="icon iconfont el-icon-qunzu" />
            <i class="el-icon-more" />
        </div>
    </div>
</template>

<script>
import Vue from "vue";
export default {
    name: "Aside",
    data() {
        return {
            msg: false,
            todoListLength: "",
            readingListLength: ""
        };
    },
    mounted: function() {
        let $self = this;
        if (Vue.prototype.socket) {
            this.socket.on("message", value => {
                // this.msg = value.from != this.$store.getters.LoginData.uid ? true : false;
                this.msg =
                    this.$route.path.indexOf("webim") > -1 ? false : true;
            });
        }
        $self.$axios
            .get(
                "/api/v1/push/513/list?type=todo&business=&page=1&pageSize=10000"
            )
            .then(res => {
               console.log(123);
               this.todoListLength = res.data.count;
            });
             $self.$axios
            .get(
                "/api/v1/push/513/list?type=reading&business=&page=1&pageSize=10000"
            )
            .then(res => {
               console.log(123);
               this.readingListLength = res.data.count;
            });
    }
};
</script>

<style lang="scss" scoped>
.aside {
    background: #f4f4f4;
    display: flex;
    width: 220px;
    flex: 0 0 auto;
    flex-direction: column;
    overflow: hidden;
}

.aside-top {
    padding-left: 18px;
    display: flex;
    align-items: center;
    height: 40px;
    flex: 0 0 auto;
    font-size: 13px;
    .icon {
        width: 48px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
    }
}

.aside-container {
    flex: 1 1 auto;
    border: 1px solid #eaeaea;
    .collapse {
        font-size: 14px;
        .title {
            font-weight: 700;
            cursor: pointer;
            height: 48px;
            line-height: 48px;
        }
        .icon {
            width: 1em;
            margin: 0 16px;
        }
        .content {
            margin-left: 4px;
            .item {
                display: flex;
                align-items: center;
                height: 36px;
                line-height: 36px;
                cursor: pointer;
                &:hover:not(.active) {
                    background: #eaeaea;
                }
            }
            .active {
                background: #c7e0f4;
                color: #0078d7;
                font-weight: 700;
            }
            a {
                color: #2c3e50;
            }
        }
    }
}

.aside-bottom {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    height: 40px;
    justify-content: space-around;
    border-right: 1px solid #eaeaea;
    box-sizing: border-box;
    .icon {
        font-size: 18px;
    }
    width: 100%;
}
</style>
