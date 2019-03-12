<template>
    <div class="drawer apps" v-click-outside="closeLeftMenu" v-bind:class="{ active: showLeftMenu }" v-on:click="showLeftMenu=true">
        <div class="icon">
            <i class="iconfont el-icon-apps" size="18" />
        </div>
        <transition name="custom-classes-transition" enter-active-class="animated slideInLeft faster">
            <div class="left-bar" v-show="showLeftMenu">
                <el-input size="small" placeholder="输入小程序名搜索" class="search" v-model="searchKey" @keyup.native="search()" prefix-icon="el-icon-search">
                </el-input>
                <div class="parent" :key="index" v-for="(items,index) in apps" v-show="searchKey.length==0">
                    <div class="type">{{items.type}}</div>
                    <div class="children">
                        <router-link :target="item.id" v-if="!item.target && !item.click && item.isVist" outside=true @click="closeLeftMenu" class="app" :key="item.id" v-for="item in items.children" :to="{ path: '/apps/'+item.to}">
                            <i outside=true class="iconfont" :class="item.icon" size="24" />
                            <div outside=true class="name">{{item.name}}</div>
                        </router-link>
                        <a :href="item.href" target="_blank" class="app" v-if="item.target && item.isVist" :key="item.id" v-for="item in items.children">
                            <i outside=true class="iconfont" :class="item.icon" size="24" />
                            <div outside=true class="name">{{item.name}}</div>
                        </a>
                        <a target="_blank" class="app" @click="href(item)" v-if="item.click && item.isVist" :key="item.id" v-for="item in items.children">
                            <i outside=true class="iconfont" :class="item.icon" size="24" />
                            <div outside=true class="name">{{item.name}}</div>
                        </a>
                    </div>
                </div>
                <div class="parent" v-if="searchKey.length>0">
                    <div class="children">
                        <template v-for="item in result_items">
                            <router-link :target="item.id" outside=true @click="closeLeftMenu" class="app" :key="item.id" :to="{ path: '/apps/'+item.to}">
                                <i outside=true class="iconfont" :class="item.icon" size="24" />
                                <div outside=true class="name">{{item.name}}</div>
                            </router-link>
                        </template>
                    </div>
                </div>

            </div>
        </transition>
    </div>
</template>

<script>
import md5 from 'js-md5';
import sha1 from 'js-sha1';
import axios from 'axios';
import ClickOutside from '@/directives/clickoutside';
export default {
    name: 'leftmenu',
    directives: {
        ClickOutside
    },
    data() {
        return {
            showLeftMenu: false,
            searchKey: '',
            items: [],
            result_items: [],
            apps: [
                {
                    type: '常用办公',
                    children: [
                        {
                            id: 1,
                            name: '发文',
                            icon: 'el-icon-fawen',
                            to: 'outgoing'
                        },
                        {
                            id: 2,
                            name: '收文',
                            icon: 'el-icon-shouwen',
                            to: 'incoming'
                        },
                        {
                            id: 10,
                            name: '部门呈报',
                            icon: 'el-icon-chengbaoshenpi',
                            to: 'submission'
                        },
                        {
                            id: 3,
                            name: '资产管理',
                            icon: 'el-icon-zichanguanli',
                            to: 'asset'
                        },
                        {
                            id: 15,
                            name: '督办管理',
                            icon: 'el-icon-inspect',
                            to: 'inspect'
                        },
                    ]
                },
                {
                    type: '会议纪要',
                    children: [
                        {
                            id: 125,
                            name: '党委会',
                            icon: 'el-icon-ziyuan',
                            to: 'partymeeting'
                        },
                        {
                            id: 121,
                            name: '董事会',
                            icon: 'el-icon-meeting',
                            to: 'boardmeeting'
                        },
                        {
                            id: 123,
                            name: '总办会',
                            icon: 'el-icon-huiyidengji',
                            to: 'gmomeeting'
                        },
                        {
                            id: 127,
                            name: '专题会',
                            icon: 'el-icon-huiyishi',
                            to: 'specmeeting'
                        },
                        {
                            id: 128,
                            name: '议题',
                            icon: 'el-icon-huiyishi',
                            to: 'discussion',
                            isVist: true
                        },
                        {
                            id: 129,
                            name: '申请表',
                            icon: 'el-icon-huiyishi',
                            to: 'applymeeting',
                            isVist: true
                        },
                        {
                            id: 130,
                            name: '招采委员会',
                            icon: 'el-icon-huiyishi',
                            to: 'recruitmentcommittee',
                            isVist: true
                        },
                        {
                            id: 131,
                            name: '会议申请(总办会)',
                            icon: 'el-icon-huiyishi',
                            to: 'agentapply',
                            isVist: true
                        }
                    ]
                },
                {
                    type: '财务报销',
                    children: [
                        {
                            id: 221,
                            name: '对私报销',
                            icon: 'el-icon-icon-test',
                            to: 'expense'
                        },
                        {
                            id: 223,
                            name: '付款申请',
                            icon: 'el-icon-fukuan',
                            to: 'payment'
                        },
                        {
                            id: 225,
                            name: '借款',
                            icon: 'el-icon-jiekuan',
                            to: 'loan'
                        },
                        {
                            id: 227,
                            name: '出差审批',
                            icon: 'el-icon-chuchashenqing',
                            to: 'travel'
                        },
                        {
                            id: 229,
                            name: '报销查询',
                            icon: 'el-icon-baoxiao',
                            to: 'statistics'
                        }
                    ]
                },
                {
                    type: '品牌宣传管理',
                    children: [
                        {
                            id: 422,
                            name: '新闻管理',
                            icon: 'el-icon-xinwenguanli1',
                            to: 'news'
                        },
                    {
                            id: 8,
                            name: '合同管理',
                            icon: 'el-icon-hetongguanli',
                            to: 'contract'
                        },
                    ]
                }
            ]
        };
    },
    methods: {
        search() {
            this.result_items = this.items.filter(item => {
                return item.name.includes(this.searchKey);
            });
        },
        closeLeftMenu() {
            this.showLeftMenu = false;
        },
        href(item) {
            if (item.to == 'intellectualproperty') {
                let iframe = document.createElement('iframe');
                iframe.src = `http://www.bjiponline.com/home/api/user/loginForGroup?username=${
                    this.$store.getters.LoginData.username
                }&stamp=111&token=${sha1(
                    '3Onicf' + this.$store.getters.LoginData.username + '111'
                )}`;
                //iframe.src = `http://www.bjiponline.com/home/api/user/loginForGroup?username=${this.$store.getters.LoginData.username}&password=d8c7c207f46404348692e4dc2853583c`;
                iframe.style.width = 0;
                iframe.style.height = 0;
                iframe.style.display = 'none';
                iframe.onload = function() {
                    window.open(
                        'http://www.bjiponline.com/home/index.html#index'
                    );
                };
                document.body.appendChild(iframe);
            }
            if (item.to == 'Industryinvestment') {
                axios
                    .get(
                        `/api/auth/jwt/getToken?userName=${
                            this.$store.getters.LoginData.username
                        }`
                    )
                    .then(res => {
                        window.open(
                            `http://39.98.89.16:8087/pms/login?password=${
                                res.data
                            }&username=${
                                this.$store.getters.LoginData.username
                            }`
                        );
                    });
            }
        },
        isVist(code) {
            return this.$store.getters.getMenus.find(
                item => item.code === code
            );
        },
        initMenus() {
            for (let app of this.apps) {
                if (app.children) {
                    for (let sub_app of app.children) {
                        if (this.isVist(sub_app.to)) {
                            this.items.push(sub_app);
                            sub_app.isVist = true;
                        }
                    }
                }
            }
        }
    },
    watch: {
        '$store.getters.getMenus': function() {
            console.log('leftmenu里面打印的值');
            console.log(this.$store.getters.getMenus);
            console.log(this.$store.getters.getMenus);
            console.log('initMenus');
            
        }
    },
    mounted() {
        this.initMenus();
    }
};
</script>

<style lang="scss" scoped>
#app {
    display: none;
}

.left-bar {
    position: absolute;
    display: none;
    top: 48px;
    left: 0;
    bottom: 0;
    width: 480px;
    background: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.2) 30px 0px 30px -30px;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    z-index: 9999;
    overflow-y: auto;
    .search {
        width: 475px;
    }
    .parent {
        margin-top: 10px;
        .type {
            margin-bottom: 5px;
            color: #aaa;
        }
        .children {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: flex-start;
            width: 480px;
            .app {
                background: #f8f8f8;
                width: 75px;
                height: 75px;
                margin: 0 5px 5px 0;
                font-size: 12px;
                font-weight: 400;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                &:hover {
                    background: #0078d7;
                    i,
                    .name {
                        color: #ffffff;
                    }
                }
                i {
                    font-size: 28px;
                    margin-bottom: 10px;
                    color: #0078d7;
                }
                .name {
                    color: #666666;
                    font-size: 13px;
                    text-align: center;
                }
            }
        }
    }
}
</style>
