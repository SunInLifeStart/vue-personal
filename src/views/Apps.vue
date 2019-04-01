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
                outgoing: "文件签发",
                incoming: "收文阅办",
                submission: "部门呈报",
                files: "文件印刷",
                approval: "用印审批",
                goods: "物品领用",
                asset: "资产采购",
                news: "新闻发布",
                publish:"信息发布",
                discussion: "议题上会",
                meetingApply: "会议申请",
                gmomeeting: "总办会纪要",
                specmeeting: "专题会纪要",
                partymeeting: "党委会纪要",
                train:"培训审批",
                processing: "入职审批",
                leave:"请假申请",
                travel:"出差审批",
                loan: "借款单",
                reimbursement: "报销审批",
                payment:"付款审批",
                expenses:"招待费审批",
                conduct: "报销单统计",
                contract: "合同签订审批",
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

