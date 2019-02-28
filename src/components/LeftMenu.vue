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
                            id: 4,
                            name: '品牌活动备案',
                            icon: 'el-icon-huodongbaogao',
                            to: 'activity'
                        },
                        {
                            id: 6,
                            name: '车辆管理',
                            icon: 'el-icon-cheliang-',
                            to: 'vehicle'
                        },
                        {
                            id: 7,
                            name: '公文管理',
                            icon: 'el-icon-doc',
                            to: 'doc'
                        },
                        {
                            id: 8,
                            name: '合同管理',
                            icon: 'el-icon-hetongguanli',
                            to: 'contract'
                        },
                        {
                            id: 9,
                            name: '办公用品',
                            icon: 'el-icon-bangongyongpin',
                            to: 'supply'
                        },
                        {
                            id: 13,
                            name: '纪检监察',
                            icon: 'el-icon-supervise',
                            to: 'super'
                        },
                        {
                            id: 14,
                            name: '综合信息发布',
                            icon: 'el-icon-publish',
                            to: 'publish'
                        },
                        {
                            id: 15,
                            name: '督办管理',
                            icon: 'el-icon-inspect',
                            to: 'inspect'
                        },
                        {
                            id: 16,
                            name: '三会议案',
                            icon: 'el-icon-huiyi',
                            to: 'motion'
                        },
                        {
                            id: 17,
                            name: '外事申报',
                            icon: 'el-icon-motion',
                            to: 'foreign'
                        },
                        {
                            id: 18,
                            name: '信息披露',
                            icon: 'el-icon-xinxi',
                            to: 'anno'
                        }
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
                            id: 421,
                            name: '宣传物料',
                            icon: 'el-icon-zhengcexuanchuan',
                            to: 'material'
                        },
                        {
                            id: 422,
                            name: '新闻管理',
                            icon: 'el-icon-xinwenguanli1',
                            to: 'news'
                        },
                        {
                            id: 423,
                            name: '媒体报道',
                            icon: 'el-icon-mtbd',
                            to: 'medium'
                        },
                        {
                            id: 424,
                            name: '政务采用',
                            icon: 'el-icon-zhengzhi',
                            to: 'government'
                        },
                        {
                            id: 425,
                            name: '图文统计',
                            icon: 'el-icon-tongji',
                            to: 'newsstatistics'
                        }
                    ]
                },
                {
                    type: '其他应用',
                    children: [
                        {
                            id: 321,
                            name: '财务报表',
                            icon: 'el-icon-yuangongcaiwubaobiao',
                            target: true,
                            to: 'financialstatement',
                            href: 'http://172.16.3.38:9797/netrep/index.jsp'
                        },
                        {
                            id: 323,
                            name: '知识产权',
                            icon: 'el-icon-zhishichanquan',
                            click: true,
                            to: 'intellectualproperty'
                        },
                        {
                            id: 325,
                            name: '产业投资',
                            click: true,
                            icon: 'el-icon-touzi',
                            to: 'Industryinvestment'
                        },
                        {
                            id: 327,
                            name: '资金结算',
                            target: true,
                            icon: 'el-icon-zhijiandan',
                            to: 'capital',
                            href: `http://10.0.6.10:8080/zhongfazhan/loginAction.action`
                        },
                        {
                            id: 327334,
                            name: '金融管理',
                            target: true,
                            icon: 'el-icon-icon-test',
                            to: 'financialinformation',
                            href: `http://www.zfz-data.com/sso.action?ipHash=7221e78520bd32faa404518ed72c7024&username=${md5(
                                'zfzsso-' +
                                    this.$store.getters.LoginData.username
                            )}`
                        },
                        {
                            id: 444,
                            name: '会议系统',
                            target: true,
                            icon: 'el-icon-duorenhuiyi',
                            to: 'meetingmanagement',
                            href: `http://61.135.44.177:8081/login/sso?ipHash=7221e78520bd32faa404518ed72c7024&username=${
                                this.$store.getters.LoginData.username
                            }&stamp=111&token=${sha1(
                                '3Onicf' +
                                    this.$store.getters.LoginData.username +
                                    '111'
                            )}`
                        },
                        {
                            id: 329,
                            name: '集团门户管理',
                            icon: 'el-icon-gaiicon-',
                            to: 'portalmananger'
                        },
                        {
                            id: 4534535,
                            name: '统计分析',
                            target: true,
                            icon: 'el-icon-tongjifenxi2 ',
                            to: 'statisticalanalysis',
                            href: `http://statistics.zgcgroup.vpn/#/index`
                        },
                        {
                            id: 6456456,
                            name: '园区管理',
                            target: true,
                            icon: 'el-icon-fengxianfenxi',
                            to: 'parkmanagement',
                            href: `http://park.zgcgroup.vpn/#/index`
                        },
                        {
                            id: 303494,
                            name: '园区产业公共服务平台',
                            target: true,
                            icon: 'el-icon-nav_user',
                            to: 'parkIndustryevaluation',
                            href: `https://zgcg.hsmap.com/#/?from=custom`
                        },
                        {
                            id: 412728,
                            name: '国有资本',
                            target: true,
                            icon: 'el-icon-zichan',
                            to: 'governmentcapital',
                            href: `http://jawny.zgcgroup.vpn/#/index`
                        },
                        {
                            id: 412729,
                            name: '协同资源',
                            target: true,
                            icon: 'el-icon-xietong',
                            to: 'collaborativeresources',
                            href: `http://resources.zgcgroup.vpn/#/index`
                        }
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
