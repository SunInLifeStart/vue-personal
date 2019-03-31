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
                outgoing: "文件签发单",
                incoming: "收文阅办单",
                submission: "部门呈报件",
                files: "名片/文件印刷",
                approval: "用印审批表",
                goods: "物品领用申请",
                asset: "资产采购申请",
                news: "公司新闻发布",
                publish:"综合信息发布",
                discussion: "议题上会单",
                meetingApply: "会议申请单",
                gmomeeting: "总办会会议纪要",
                specmeeting: "专题会会议纪要",
                partymeeting: "党委会会议纪要",
                train:"培训审批表",
                processing: "入职办理审批表",
                leave:"请假申请表",
                travel:"出差审批表",
                loan: "借款单",
                reimbursement: "报销审批单",
                payment:"付款审批单",
                expenses:"招待费审批表",
                conduct: "进行中报销单统计",
                contract: "合同签订审批表",
                ledger: "合同台账",
                programme: "采购方案",
                tendering: "招标文件",
                results:"采购结果",
                abnormal: "招标异常事项",
                supplier: "供应商引入审批",
                portalmananger:"门户管理后台"
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

