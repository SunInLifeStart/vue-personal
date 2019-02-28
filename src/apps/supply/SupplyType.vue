<template>
    <div id="SupplyType">
        <el-card class="box-card">
            <SupplyTypeFilter @searchList="getSearchOptions" ref="supplytypefilter"></SupplyTypeFilter>
            <div class="toolbar">
                <el-button type="primary" icon="el-icon-plus" @click="createForm">新建</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="addTypea">新建用品种类</el-button>
            </div>
            <SupplyTypeList ref="supplytypelist" @formId="getFormId" @editForm="editForm" :searchOptions="this.searchOptions"></SupplyTypeList>
        </el-card>
        <br>
        <el-card class="box-card">
            <SupplyTypeDetail :formId="formId" ref="supplytypedetail"></SupplyTypeDetail>
        </el-card>
        <el-dialog title="办公用品" :visible.sync="dialogFormVisible" max-width="1280px" width="70%" :close-on-click-modal="false">
            <SupplyTypeForm @refreshData="refreshData" @refreshDetailForm="refreshDetailForm" @saveStatusType="saveStatusType" ref="supplytypeform" :formId="dialogFormId" :operationType="operationType"></SupplyTypeForm>
            <div slot="footer" class="dialog-footer">
                <el-button type="default" @click="saveForm">保存</el-button>
                <el-button type="default" @click="cancle">取消</el-button>
            </div>
        </el-dialog>
        <!-- :modal-append-to-body="false" -->
        <el-dialog title="新建用品种类" :visible.sync="dialogFormVisibleAddType" max-width="1280px" width="70%" :close-on-click-modal="false">
            <SupplyForm @refreshDataType="refreshDataType" ref="supplyform"></SupplyForm>
            <div id="but">
                <el-button type="primary" @click="saveFormType">保存</el-button>
                <el-button type="default" @click="resetTitle">重置</el-button>
            </div>
            <SupplyList ref="supplylist" @refreshDataEditType="refreshDataEditType"></SupplyList>
        </el-dialog>
    </div>
</template>
<script>
import SupplyTypeFilter from './SupplyTypeFilter';
import SupplyTypeForm from './SupplyTypeForm';
import SupplyForm from './SupplyForm';
import SupplyList from './SupplyList';
import SupplyTypeList from './SupplyTypeList';
import SupplyTypeDetail from './SupplyTypeDetail';
export default {
    name: 'SupplyType',
    mounted() {},
    data() {
        return {
            dialogFormVisible: false,
            dialogFormVisibleAddType: false,
            searchOptions: [],
            formId: '',
            dialogFormId: '',
            operationType: 'create'
        };
    },
    components: {
        SupplyTypeFilter,
        SupplyTypeForm,
        SupplyTypeList,
        SupplyTypeDetail,
        SupplyForm,
        SupplyList
    },
    methods: {
        refreshDetailForm() {
            if (this.$refs.supplytypedetail) {
                this.$refs.supplytypedetail.getForm();
            }
        },
        handleClick(tab, event) {},
        getSearchOptions(searchOptions) {
            this.searchOptions = searchOptions;
        },
        addTypea() {
            this.dialogFormVisibleAddType = true;
            if (this.$refs.supplyform) {
                this.$refs.supplyform.resetType();
            }
        },
        getFormId(id) {
            this.formId = id;
        },
        createForm() {
            this.dialogFormVisible = true;
            this.operationType = 'create';
            if (this.$refs.supplytypeform) {
                this.$refs.supplytypeform.clearForm();
            }
        },
        editForm(id) {
            this.dialogFormId = id;
            this.dialogFormVisible = true;
            this.operationType = 'edit';
        },
        refreshData() {
            this.$refs.supplytypelist.getList();
        },
        saveForm() {
            this.$refs.supplytypeform.saveFormValidate();
        },
        saveStatusType(status) {
            this.dialogFormVisible = status;
        },
        saveFormType() {
            this.$refs.supplyform.saveFormValidate();
            this.$refs.supplytypefilter.getList();
            // this.dialogFormVisibleAddType = false;
        },
        cancle() {
            this.dialogFormVisible = false;
        },
        refreshDataType() {
            this.$refs.supplylist.getList();
            this.$refs.supplytypefilter.getList();
        },
        refreshDataEditType() {
            this.$refs.supplytypefilter.getList();
        },
        resetTitle() {
            this.$refs.supplyform.resetType();
        }
    }
};
</script>
<style lang="scss" scoped>
#SupplyType {
    #but {
        position: absolute;
        top: 85px;
        left: 365px;
    }
}
</style>