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
                asset: "资产申请",
                contract: "合同管理",
                news: "新闻管理",
                inspect: "督办管理",
                gmomeeting: "总办会会议纪要",
                boardmeeting: "董事会会议纪要",
                discussion: "议题上会单",
                applymeeting: "会议申请",
                agentapply: "会议申请(总办会)",
                recruitmentcommittee: "招采委员会",
                specmeeting: "专题会会议纪要",
                partymeeting: "党委会会议纪要",
                loan: "借款申请",
                payment:"付款申请",
                expense:"报销申请",
                travel:"出差申请",
                portalmananger:"集团门户管理"
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

