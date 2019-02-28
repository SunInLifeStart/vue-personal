<template>
    <div id="Payment" class="main-container">
        <div class="content-container">
            <el-card class="box-card">
                <PaymentFilter @searchList="getSearchOptions"></PaymentFilter>
                <div class="toolbar">
                    <el-button type="primary" icon="el-icon-plus" @click="addForm">新建</el-button>
                </div>
                <PaymentList ref="Paymentlist" @formId="getFormId" @editForm="editForm" :searchOptions="searchOptions"></PaymentList>
            </el-card>
            <br>
            <el-card class="box-card">
                <PaymentDetail ref="PaymentDetail"  @refreshData="refreshData" :formId="formId"></PaymentDetail>
            </el-card>
        </div>
        <el-dialog title="付款申请单" :visible.sync="dialogFormVisible" width="1240px" :close-on-click-modal="false">
            <PaymentForm ref="Paymentform" @info="getInfo" @refreshData="refreshData" :formId="dialogFormId" :operationType="operationType"></PaymentForm>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button type="default" @click="saveForm" v-if="this.showStatus == ''" v-show="operationType!=='create'||isinfo=='add'">保存</el-button> -->
                <el-button type="default" @click="saveForm" v-show="operationType!=='create'||isinfo=='add'">保存</el-button>
                <el-button type="primary" @click="submitForm" v-show="operationType!=='create'||isinfo=='add'">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
/* eslint-disable */
import PaymentForm from './PaymentForm';
import PaymentFilter from './PaymentFilter';
import PaymentList from './PaymentList';
import PaymentDetail from './PaymentDetail';
export default {
    name: 'Payment',
    mounted() {},
    data() {
        return {
            activeName: '1',
            dialogFormVisible: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create',
            isinfo: '',
            showStatus: '',
            actions: [
                {
                    id: '1',
                    name: '名称',
                    ms: 'miaoshu '
                }
            ]
        };
    },
    components: {
        PaymentForm,
        PaymentFilter,
        PaymentList,
        PaymentDetail
    },
    methods: {
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        getFormId(id) {
            this.formId = id;
        },
        getInfo(info) {
            this.isinfo = info;
            if (this.isinfo == 'success') {
                this.dialogFormVisible = false;
                this.isinfo = '';
            }
        },
        addForm() {
            this.showStatus = '';
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.Paymentform) {
                this.$refs.Paymentform.clearForm();
            }
        },
        editForm(id) {
            this.showStatus = '已驳回';
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
            // if (this.$refs.Paymentform) {
            //     this.$refs.Paymentform.getForm();
            // }
        },
        refreshData() {
            this.$refs.Paymentlist.getList();
            this.$refs.PaymentDetail.getForm();
        },
        saveForm() {
            this.$refs.Paymentform.submitCheck();
        },
        submitForm() {
            this.$refs.Paymentform.submitCheck('save');
        }
    }
};
</script>
<style lang="scss">
</style>