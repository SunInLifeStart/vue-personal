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
                        <router-link :target="item.id" v-if="!item.target && !item.click && item.isVist && !item.frombudget" outside=true @click="closeLeftMenu" class="app" :key="item.id" v-for="item in items.children" :to="{ path: '/apps/'+item.to}">
                        <!-- <router-link :target="item.id" v-if="!item.target && !item.click" outside=true @click="closeLeftMenu" class="app" :key="item.id" v-for="item in items.children" :to="{ path: '/apps/'+item.to}"> -->
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
                    id:'commonly',
                    children: [
                        {
                            id: "commonly_1",
                            name: '文件签发',
                            icon: 'el-icon-fawen',
                            to: 'outgoing'
                        },
                        {
                            id: "commonly_2",
                            name: '收文阅办',
                            icon: 'el-icon-shouwen',
                            to: 'incoming'
                        },
                        {
                            id: "commonly_3",
                            name: '部门呈报',
                            icon: 'el-icon-chengbaoshenpi',
                            to: 'submission'
                        },
                        {
                            id: "commonly_13",
                            name: '名片印刷',
                            icon: 'el-icon-mingpian',
                            to: 'businessCard'
                            // 没有
                        },
                         {
                            id: "commonly_4",
                            name: '文件印刷',
                            icon: 'el-icon-mingpian',
                            to: 'files'
                            // 没有
                        },
                        {
                            id: "commonly_5",
                            name: '资产采购',
                            icon: 'el-icon-zichanguanli',
                            to: 'asset'
                        },
                         {
                            id: "commonly_6",
                            name: '用印审批',
                            icon: 'el-icon-yongyin',
                            to: 'approval'
                            // 没有
                        },
                         {
                            id: "commonly_8",
                            name: '物品领用',
                            icon: 'el-icon-wupinfanghang',
                            to: 'goods'
                            // 没有
                        },
                         {
                            id: "commonly_9",
                            name: '新闻发布',
                            icon: 'el-icon-xinwenguanli1',
                            to: 'news'
                        },
                         {
                            id: "commonly_11",
                            name: '督办',
                            icon: 'el-icon-inspect',
                            to: 'inspect'
                        },
                        {
                            id: "commonly_10",
                            name: '信息发布',
                            icon: 'el-icon-publish',
                            to:'publish'
                        }
                        
                    ]
                },
                {
                    type: '会议管理',
                     id: "metting",
                    children: [
                        {
                            id: "metting_1",
                            name: '会议申请',
                            icon: 'el-icon-huiyi',
                            to: 'meetingApply',
                            // 没有
                        },
                        {
                            id: "metting_2",
                            name: '议题上会',
                            icon: 'el-icon-duorenhuiyi',
                            to: 'discussion'
                        },
                        {
                            id: "metting_3",
                            name: '会议纪要',
                            icon: 'el-icon-ziyuan',
                            to: 'meetingSummary'
                            //没有
                        },
                        {
                            id: "metting_3",
                            name: '总办会纪要',
                            icon: 'el-icon-huiyidengji',
                            to: 'gmomeeting'
                            //没有
                        },
                        {
                            id: "metting_4",
                            name: '专题会纪要',
                            icon: 'el-icon-huiyishi',
                            to: 'specmeeting'
                            //没有
                        },
                        
                        {
                            id: "metting_5",
                            name: '党委会纪要',
                            icon: 'el-icon-ziyuan',
                            to: 'partymeeting'
                            //没有
                        }
                    ]
                },
                {
                    type: '人事管理',
                    id: "personnel",
                    children: [
                        {
                            id: "personnel_1",
                            name: '培训审批',
                            icon: 'el-icon-peixun',
                            to: 'train'
                        },
                        {
                            id: "personnel_2",
                            name: '入职审批',
                            icon: 'el-icon-yuangongruzhi',
                            to: 'processing'
                            //没有
                        },
                         {
                            id: "personnel_3",
                            name: '请假申请',
                            icon: 'el-icon-icon-test1',
                            to: 'leave'
                        },
                        {
                            id: "personnel_4",
                            name: '出差审批',
                            icon: 'el-icon-chuchashenqing',
                            to: 'travel'
                            //没有
                        },
                       
                    ]
                },
                 {
                    type: '财务报销',
                    id: "finance",
                    children: [
                        {
                            id: "finance_1",
                            name: '借款单',
                            icon: 'el-icon-jiekuan',
                             to: 'loan'
                            //没有
                        },
                        {
                            id: "finance_2",
                            name: '报销审批',
                            icon: 'el-icon-baoxiao',
                            to: 'reimbursement'
                            //没有
                        },
                         {
                            id: "finance_3",
                            name: '付款审批',
                            icon: 'el-icon-fukuan',
                            to: 'payment'
                            //没有
                        },
                        {
                            id: "finance_4",
                            name: '招待费审批',
                            icon: 'el-icon-qian4',
                            to: 'expenses'
                            //没有
                        },
                       
                        {
                            id: "finance_5",
                            name: '报销单统计',
                            icon: 'el-icon-baoxiao1',
                            to: 'conduct'
                            //没有
                        }
                    ]
                },
               {
                    type: '合同管理',
                    id: "contract",
                    children: [
                        {
                            id: "contract_1",
                            name: '合同审批',
                            icon: 'el-icon-hetong',
                            to: 'contract'
                        },
                       {
                            id: "contract_2",
                            name: '合同台账',
                            icon: 'el-icon-hetongxiazaixin-',
                            to: 'ledger'
                            // 没有
                        },
                    ]
                },
                 {
                    type: '招采管理',
                    id: "recruitment",
                    children: [
                        {
                            id: "recruitment_1",
                            name: '采购方案',
                            icon: 'el-icon-icon-cart',
                            to: 'programme'
                            // 没有
                        },
                        
                        {
                            id: "recruitment_2",
                            name: '招标文件',
                            icon: 'el-icon-zhaobiaofangan',
                            to: 'tendering'
                            //没有
                        },
                         {
                            id: "recruitment_3",
                            name: '采购结果',
                            icon: 'el-icon-caigoudan',
                            to: 'results'
                            // 没有
                        },
                        {
                            id: "recruitment_4",
                            name: '招标异常事项',
                            icon: 'el-icon-zhaobiaojieshu2',
                            to: 'abnormal'
                            // 没有
                        },
                       
                        {
                            id: "recruitment_5",
                            name: '供应商引入审批',
                            icon: 'el-icon-supplier',
                            to: 'supplier'
                            // 没有
                        }
                    ]
                },
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
                            console.log(sub_app);
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
    width: 470px;
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
        width: 450px;
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
            width: 470px;
            .app {
                background: #f8f8f8;
                width: 80px;
                height: 75px;
                margin: 0 12px 8px 0;
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
