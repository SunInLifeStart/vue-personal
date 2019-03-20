<template>
<div id="app">
    <div class="apps">
        <div class="app">
            <component ref="detail" :formId="formId" :is="view"></component>
        </div>
    </div>
</div>
</template>

<script>

export default {
  name: "apps",
  props: ["appname","formId"],
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
        supervise: "纪检监察",
        meeting: "会议纪要",
        leave:"请休假申请"
      }
    };
  },
  components: {
  },
  mounted() {
    let start = this.appname.charAt(0).toUpperCase();
    let end = this.appname.substr(1);
    this.view = () => import(`@/apps/${this.appname}/Approve.vue`);
    //document.title = this.apps[this.appname];
  }
};
</script>

<style lang="scss" scoped>
.apps {
  height:100%;
  overflow-y: auto;
  .app {
    max-width: 1280px;
    margin: 20px auto;
    overflow: hidden;
  }
}
</style>

