<template>
  <div id="app">

    <TopBar />
    <div class="apps">
      <div class="app">
        <component ref="detail" :is="view"></component>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
export default {
    name: "apps",
    props: ["appname"],
    data() {
        return {
            view: "",
            apps: {
                outgoing: "发文拟稿",
                incoming: "收文登记",
                submission: "部门呈报",
                supply: "办公用品",
                vehicle: "车辆管理",
                asset: "资产申请",
                contract: "合同管理",
                news: "新闻管理",
                activity: "活动报告",
                motion: "三会议案",
                inspect: "督办管理",
                publish: "综合事务信息发布",
                doc: "公文管理",
                super: "纪检监察",
                gmomeeting: "总办会会议纪要",
                boardmeeting: "董事会会议纪要",
                specmeeting: "专题会会议纪要",
                partymeeting: "党委会会议纪要",
                foreign: "外事申报",
                anno: "信息披露",
                government: "政务采用",
                medium: "媒体报道",
                loan: "借款申请",
                payment:"付款申请",
                expense:"报销申请",
                travel:"出差申请",
                statistics:"报销查询",
                material:"宣传物料",
                newsstatistics:"新闻统计",
                portalmananger:"集团门户管理",
                budgetplanCompany:"资金计划公司汇总人（财务领导）总经理董事长",
                budgetsys: "预算系统",
                budgeting: "部门预算",
                budgetingsignal: "部门预算情况单",
                budgetingform: "部门预算报表",
                fundplan: "资金计划（部门）"
            }
        };
    },
    components: {
        TopBar
    },
    watch: {
        appname: function(){
            let start = this.appname.charAt(0).toUpperCase();
            let end = this.appname.substr(1);
            this.view = () =>
            import(`@/apps/${this.appname}/index.vue`);
            document.title = this.apps[this.appname];
        }
    },
    mounted() {
        let start = this.appname.charAt(0).toUpperCase();
        let end = this.appname.substr(1);
        this.view = () => import(`@/apps/${this.appname}/index.vue`);
        document.title = this.apps[this.appname];
    }
};
</script>

<style lang="scss" scoped>
.apps {
    background: #f3f3f3;
    height: 100%;
    overflow-y: auto;
    .app {
        max-width: 1240px;
        margin: 20px auto;
        overflow: hidden;
    }
}
</style>

