<template>
    <div id="SupplyStaticsForm">
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="type" @input="filter" placeholder="请输入用品名称" prefix-icon="el-icon-search"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="SeeChecked">仅显示已选</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="AllChecked" @change="allchecked">全选</el-checkbox>
            </el-form-item>
        </el-form>
        <el-row class="cell">
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="4">名称</el-col>
            <el-col :span="4">单价</el-col>
            <el-col :span="4">图片</el-col>
            <el-col :span="3">库存量</el-col>
            <el-col :span="3">在途数量</el-col>
            <el-col :span="4">申请数量</el-col>
        </el-row>
        <el-row class="cell" :key="item.id" v-for="item in listdata" v-show="(!SeeChecked || item.checked) && !item.hide">
            <el-col :span="2">
                <el-checkbox v-model="item.checked" @change="itemChange"></el-checkbox>
            </el-col>
            <el-col :span="4">
                <span style="display: inline-block; width: 100%;">{{item.name}}</span>
            </el-col>
            <el-col :span="4">{{item.price}}</el-col>
            <el-col :span="4"><img :src="item.picture" style="width: 25px; height: 25px"></el-col>
            <el-col :span="3" style="height:30px;width:100px">{{item.quantity}}</el-col>
            <el-col :span="3" style="height:30px;width:100px">{{item.sq_quantitys}}</el-col>
            <el-col :span="4">
                <el-input style="height:30px;width:150px" :disabled="!item.checked" v-model="item.sq_quantity"> </el-input>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'SupplyStaticsForm',
    data() {
        return {
            type: '',
            SeeChecked: false,
            AllChecked: false,
            listdata: [],
            currentFormId: '',
            singal: 1
        };
    },
    computed: {},
    mounted() {
        if (this.singal == 1) {
            this.getFList();
        }
        this.singal++;
    },
    methods: {
        //全选时操作
        allchecked(val) {
            for (let data of this.listdata) {
                data.checked = this.AllChecked;
            }
        },
        //判断全选是否勾选
        itemChange() {
            let qqqq = true;
            for (let item of this.listdata) {
                if (!item.checked) {
                    qqqq = false;
                }
            }
            this.AllChecked = qqqq;
        },
        /** 
        itemChecked(val) {
            console.log(val);
        },
        */
        getFList() {
            axios.get('/api/v1/supply_forms/supplies/cart').then(res => {
                for (let item of res.data) {
                    if (item.selected) {
                        item.checked = true;
                    } else {
                        item.checked = false;
                    }
                }
                this.listdata = res.data;
                this.itemChange();
            });
        },
        filter() {
            for (let data of this.listdata) {
                if (data.name.includes(this.type)) {
                    data.hide = false;
                } else {
                    data.hide = true;
                }
            }
        },
        messageCheck(type) {
            let submitData = [];
            for (let data of this.listdata) {
                if (data.checked) submitData.push(data);
            }
            let booleanType = true;
            for (let data of submitData) {
                data.quantity = data.quantity != '' ? data.quantity : '0';
                if (
                    parseInt(data.quantity) -
                        parseInt(data.sq_quantity) -
                        parseInt(data.sq_quantitys) <
                    0
                ) {
                    booleanType = false;
                }
            }
            if (booleanType) {
                if (type == 'save') {
                    this.saveForm();
                    this.$emit('saveStatus', false);
                } else if (type == 'submit') {
                    this.submitCheck();
                    this.$emit('saveStatus', false);
                }
            } else {
                this.$message({
                    message: '申请数量不得超过库存量',
                    type: 'error'
                });
            }
        },
        saveForm() {
            let submitData = [];
            for (let data of this.listdata) {
                if (data.checked) submitData.push(data);
            }
            let param = [];
            for (let i = 0; i < submitData.length; i++) {
                let singalparam = {
                    productId: submitData[i].id,
                    sq_quantity: submitData[i].sq_quantity
                };
                param.push(singalparam);
            }
            const self = this;
            axios
                .post('/api/v1/supply_forms/saveCart', JSON.stringify(param), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    // self.currentFormId = res.data.id;
                    // self.$emit('refreshData');
                    //   self.submitForm();
                    self.$message({
                        message: '添加购物车成功',
                        type: 'success'
                    });
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        deleteSave() {
            const param = [];
            axios
                .post('/api/v1/supply_forms/saveCart', JSON.stringify(param), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {})
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        submitCheck() {
            this.saveFormSubmit();
        },
        saveFormSubmit() {
            let submitData = [];
            for (let data of this.listdata) {
                if (data.checked) submitData.push(data);
            }
            let param = [];
            for (let i = 0; i < submitData.length; i++) {
                let singalparam = {
                    productId: submitData[i].id,
                    sq_quantity: submitData[i].sq_quantity,
                    price: submitData[i].price,
                    creatorId: submitData[i].creatorId,
                    classify: submitData[i].classify,
                    specification: submitData[i].specification,
                    name: submitData[i].name,
                    unit: submitData[i].unit,
                    picture: submitData[i].picture,
                    created: submitData[i].created
                };
                param.push(singalparam);
            }
            const params = {
                item: param
            };
            const self = this;
            axios
                .post('/api/v1/supply_forms/save', JSON.stringify(params), {
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .then(res => {
                    self.currentFormId = res.data.id;
                    //self.deleteSave();
                    self.submitForm();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        submitForm() {
            const self = this;
            axios
                .post(
                    '/api/v1/supplies/' + this.currentFormId + '/create',
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    if (res.data.id != '') {
                        self.commitForm(res.data.id);
                    }
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        commitForm(processId) {
            const self = this;
            axios
                .put(
                    '/api/v1/supply_forms/' +
                        this.currentFormId +
                        '/commit/' +
                        processId,
                    '',
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.startProcess();
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        },
        comment() {
            let self = this;
            axios
                .put(`/api/v1/supply_forms/${self.currentFormId}/comment`, {
                    content: '提交',
                    action: 'COMMIT',
                    node: '提交'
                })
                .then(res => {});
        },
        startProcess() {
            const self = this;
            const params = {
                action: 'COMMIT'
            };
            axios
                .put(
                    '/api/v1/supplies/' + this.currentFormId + '/signal',
                    JSON.stringify(params),
                    {
                        headers: {
                            'Content-type': 'application/json'
                        }
                    }
                )
                .then(res => {
                    self.$emit('refreshData');
                    self.comment();
                    self.deleteSave();
                    self.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                })
                .catch(function() {
                    self.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                });
        }
    }
};
</script>
<style lang="scss" scoped>
.cell {
    margin: 5px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
}
</style>
