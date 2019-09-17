<template>
    <div class="main">
        <div class="main-container">
            <Aside/>
            <split-pane class="container" v-on:resize="resize" :min-percent="20" :default-percent="30" split="vertical">
                <template slot="paneL">
                    <div slot="left" class="split-pane-left">
                        <div class="main-top">
                            <div class="main-top-left">
                                <el-dropdown @command="handleType">
                                    <el-button type="text">
                                        {{command}}
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :key="type" :command="type" v-for="type in types">{{type}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                            <div class="main-top-right"></div>
                        </div>
                        <div class="items">
                            <el-alert title type="success" center class="alert" v-if="getNewTodo > 0">
                                <a @click="loadNew">有新的待办事项</a>
                            </el-alert>
                            <div class="item" :class="{active:messageId==item.id}" @click="openContent(item,index)" :key="item.id" v-show="!item.hide" v-for="(item,index) in items">
                                <div class="avatar">
                                    <img src="@/assets/avatar.png" width="30" alt>
                                </div>
                                <div class="content">
                                    <div class="from" :class="{todo: (type == 'todo' || type == 'reading') ? true : false,readed:item.readed}">
                                        <div class="from-title">{{item.from.name}} - {{item.from.title}} - 「{{item.businessType.cn}}」</div>
                                        <div class="from-type">{{item.time|dateFromNow}}</div>
                                        <div class="from-delete" @click.stop="deleteTodo(item)" v-if="type != 'todo'">
                                            <el-button type="text" icon="el-icon-delete"></el-button>
                                        </div>
                                    </div>
                                    <div class="title" :class="{todo: (type == 'todo' || type == 'reading') ? true : false,readed:item.readed}">{{item.body.title}}</div>
                                    <div class="describe" style="display:none;">{{item.body.content}}</div>
                                </div>
                            </div>
                            <div class="empty-data" v-if="items.length==0">
                                <img src="../assets/noData.png" width="200">
                                <div style="margin-top:10px;font-size:16px;color:#aaa;text-align:center">此文件夹为空。</div>
                            </div>
                        </div>
                    </div>
                </template>
                <template slot="paneR">
                    <div slot="right" class="split-pane-right">
                        <div class="main-top" v-if="!formId"></div>
                        <div class="split-pane-right-bottom">
                            <div class="forms">
                                <!--:class="{noread: this.showbutton ,readed:this.showbutton==false}"-->
                                <!--:class="{noread: this.showbutton ,readed:this.showbutton==false}"@click="hasreaded"-->
                                <el-button type="primary" v-if="type == 'reading' && this.showbutton" @click="hasreaded" :disabled="!this.showbuttoncolor" :class="{colorshowccc:!this.showbuttoncolor,colorshowfff:this.showbuttoncolor}" style="position: absolute;top: 3px;right: 20px;z-index: 9999;">已阅</el-button>
                                <component ref="detail" :is="currentView" :formId="formId"></component>
                            </div>
                            <div class="empty-data" v-if="!formId && items.length>0">
                                <img src="../assets/noData.png" width="200">
                                <div style="margin-top:10px;font-size:16px;color:#aaa;">请选择要阅读的项目</div>
                            </div>
                        </div>
                    </div>
                </template>
            </split-pane>
        </div>
    </div>
</template>

<script>
import Aside from '@/components/Aside.vue';
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
    props: ['type'],
    data() {
        return {
            items: [],
            actions: [],
            types: ['全部'],
            command: '全部',
            crumb: {
                items: []
            },
            showbutton: false,
            showbuttoncolor: false,
            showshow: false,
            comment: '',
            currentView: '',
            newsView: '',
            editView: '',
            formId: '',
            messageId: '',
            dialogFormVisible: false,
            dialogFormNews: false,
            businessType: '',
            attachments: undefined,
            currentIndex: -1
        };
    },
    directives: {},
    components: {
        Aside
    },
    computed: {
        ...mapGetters(['LoginData', 'getNewTodo', 'getNewMessage'])
    },
    methods: {
        loadNew() {
            this.getWorkFlow();
            this.$store.dispatch('addTodo', 0);
        },
        openContent(item, index) {
            const self = this;
            this.showbutton = false;
            (this.showbuttoncolor = false),
                (this.businessType = item.businessType);
            this.formId = '';
            if (this.businessType.en.indexOf('-') > -1) {
                this.businessType = item.businessType.en.replace('-', '');
                this.currentView = () =>
                    import(`@/apps/${this.businessType}/Approve.vue`);
            } else {
                this.currentView = () =>
                    import(`@/apps/${this.businessType.en}/Approve.vue`);
            }

            this.formId = item.body.businessKey;
            this.messageId = item.id;
            if (this.type == 'reading' && !item.readed) {
                this.currentIndex = index;
                self.showbutton = true;
                setTimeout(function() {
                    self.showbuttoncolor = true;
                    // self.showshow = true;
                }, 10000);
            }
            if (this.type == 'todo' && !item.readed) {
                axios
                    .get(
                        `/api/v1/push/${this.LoginData.uid}/messages/${
                            item.id
                        }/read?type=${this.type}`
                    )
                    .then(res => {
                        if (res.data.status == 200) {
                            // item.unreaded = true;
                            this.$set(item, 'readed', true);
                        }
                    });
            }
        },
        /**
         *  if (
                (this.type == 'todo' || this.type == 'reading') &&
                !item.readed
            ) {
                axios
                    .get(
                        `/api/v1/push/${this.LoginData.uid}/messages/${
                            item.id
                        }/read?type=${this.type}`
                    )
                    .then(res => {
                        if (res.data.status == 200) {
                            // item.unreaded = true;
                            this.$set(item, 'readed', true);
                        }
                    });
            }
         */
        hasreaded() {
            if (this.showbutton) {
                axios
                    .get(
                        `/api/v1/push/${this.LoginData.uid}/messages/${
                            this.messageId
                        }/read?type=${this.type}`
                    )
                    .then(res => {
                        if (res.data.status == 200) {
                            this.$set(
                                this.items[this.currentIndex],
                                'readed',
                                true
                            );
                            this.showbutton = false;
                        }
                    });
            }
        },
        handleType(command) {
            for (let item of this.items) {
                if (command == '全部' || item.businessType.cn == command) {
                    this.$set(item, 'hide', false);
                } else {
                    this.$set(item, 'hide', true);
                }
            }
            this.command = command;
        },
        getWorkFlow() {
            axios
                .get(`/api/v1/push/${this.$store.getters.LoginData.uid}/list`, {
                    params: {
                        type: this.type,
                        business: '',
                        page: 1,
                        pageSize: 10000
                    }
                })
                .then(res => {
                    this.items = res.data.content;
                    // this.items.todo =  this.type == "todo" ? true : false;
                    this.$root.formId = '';
                    this.messageId = '';
                    this.command = '全部';
                    for (let item of this.items) {
                        if (!this.types.includes(item.businessType.cn)) {
                            this.types.push(item.businessType.cn);
                        }
                    }
                });
        },
        resize() {},
        deleteTodo(_item) {
            this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios
                    .get(
                        `/api/v1/push/${this.LoginData.uid}/messages/${
                            _item.body.businessKey
                        }/remove/${this.type}`
                    )
                    .then(res => {
                        this.items.splice(
                            this.items.findIndex(item => item.id === _item.id),
                            1
                        );
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
            });
        }
    },

    watch: {
        getLoginData() {
            this.getWorkFlow();
        },
        $route(to, from) {
            this.getWorkFlow();
        },
        '$root.formId'() {
            this.formId = this.$root.formId;
        },
        '$root.currentView'() {
            this.currentView = this.$root.currentView;
        }
    },
    created() {
        this.getWorkFlow();
    }
};
</script>

<style lang="scss">
.main {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.main-top {
    display: flex;
    flex: 0 0 auto;
    background: #f4f4f4;
    height: 40px;
    border-bottom: 1px solid #eaeaea;
    padding-left: 10px;
    .main-top-left {
        flex: 1;
    }
    .main-top-right {
        flex: 1;
        text-align: right;
    }
}

.main-container {
    height: 100%;
    display: flex;
    flex: 1 1 auto;
    border-top: 1px solid #eaeaea;
    .alert {
        width: auto;
        margin: 10px;
    }
    .container {
        flex: 1 1 auto;
    }
}

.split-pane-left {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex: 0 0 auto;
    overflow-y: auto;
    overflow-x: hidden;
    .from-delete {
        position: absolute;
        display: none;
        right: 10px;
        bottom: 0px;
        cursor: pointer;
    }
    .items {
        flex: 1 1 auto;
        overflow-y: auto;
        .item {
            position: relative;
        }
        :hover {
            .from-delete {
                display: block;
            }
        }
    }
}

.split-pane-right {
    background: #f4f4f4;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: 100%;
    overflow-x: hidde;
    overflow-y: auto;
    .main-top {
        text-align: left;
        padding-right: 20px;
        button {
            margin: 0 10px;
        }
    }
    .split-pane-right-bottom {
        background: #fff;
        flex: 1 1 auto;
        overflow-y: hidden;
        overflow-x: hidden;
        border-left: 1px solid #eaeaea;
        height: 100%;
        .forms {
            flex: 0 0 auto;
            background: #fff; // padding: 0px 30px 30px 0px;
            height: 100%;
            position: relative;
            .colorshowccc {
                background: #ccc;
                border-color: #ccc;
            }
            .colorshowfff {
                background: #337bb1;
                border-color: #337bb1;
            }
        }
    }
}
.splitter-pane-resizer {
    margin-top: 41px;
}
.empty-data {
    margin: 0 auto;
    margin-top: 200px;
    text-align: center;
}

.el-form-item__label {
    font-weight: 600;
}
</style>
