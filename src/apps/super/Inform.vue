<template>
    <div id="Inform">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h4>在线举报</h4>
                <el-button class="new-notice" type="primary" @click="dialogVisible = true">在线举报</el-button>
            </div>
            <InformFilter></InformFilter>
            <InformList></InformList>
            <el-dialog title="在线举报" :visible.sync="dialogVisible" width="50%">
                <InformDetail></InformDetail>
            </el-dialog>
        </el-card><br>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <h4>举报信箱</h4>
                <el-button type="primary" class="new-notice" style="margin-left:10px">批量删除</el-button>
                <el-button class="new-notice" type="primary" @click="dialogVisible1 = true">举报信箱</el-button>
            </div>
            <MailLIst></MailLIst>
            <div>
                <el-dialog title="添加举报信息" :visible.sync="dialogVisible1" width="30%">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="名称">
                            <el-input v-model="form.name"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input v-model="form.region"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible1 = false">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible1 = false">保 存</el-button>
                    </span>
                </el-dialog>
            </div>
        </el-card><br>
        <InformForm></InformForm>
    </div>
</template>
<script>
import InformFilter from './InformFilter';
import InformList from './InformList';
import MailLIst from './MailLIst';
import InformDetail from './InformDetail';
import InformForm from './InformForm';
export default {
    name: 'Inform',
    data() {
        return {
            dialogVisible: false,
            dialogVisible1: false,
            form: {
                name: '',
                region: ''
            }
        };
    },
    components: {
        InformFilter,
        InformList,
        MailLIst,
        InformDetail,
        InformForm,
    },
    methods: {
        handleClick() {},
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(() => {
                    done();
                })
                .catch(() => {});
        },
        sizeChange(pageSize) {
            this.params.pageSize = pageSize;
            this.getList();
        },
        currentChange(pageNum) {
            this.params.pageNum = pageNum;
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
#Inform {
    h4 {
        margin: 0;
        padding: 0;
    }
    .new-notice {
        float: right;
        margin: -32px 0 0 0;
    }
}
</style>


