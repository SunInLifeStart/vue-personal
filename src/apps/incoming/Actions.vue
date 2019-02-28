<template>
  <div id="actions">
    <el-form>
      <el-row v-if="actions && actions.length>0">
        <div>
          <span v-for="action in actions" :key="action.type" class="btnList" @click="doAction(action)">
                <i class="el-icon-edit-outline"></i>  {{action.name}}
          </span>
        </div>
      </el-row>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" center width="30%" append-to-body>
        <el-form>
            <el-form-item label="请选择驳回节点" v-show="reject_status">
                <el-select v-model="rejectTarget"  style="width:100%;">
                    <el-option v-for="user in rejectList" :key="user" :label="user" :value="user">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item :label="seleteUserLabel" v-show="presign_status">
                 <el-select v-model="seleteUsers" filterable multiple style="width:100%;">
                    <el-option v-for="user in users" :key="user.id" :label="user.name" :value="user.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="审批意见">
                <el-input type="textarea" :rows="2" placeholder="请输入审批意见" v-model="textarea">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
    name: "actions",
    mounted() {},
    data() {
        return {
            actions: [],
            rejectTarget: "",
            rejectList: [],
            reject_status: false,
            presign_status: false,
            seleteUsers: [],
            seleteUserLabel: "",
            textarea: "",
            dialogVisible: false,
            multiple: true,
            currentAction: "",
            submitData: {},
            users: []
        };
    },
    props: ["formId"],
    watch: {
        formId: {
            handler(newName, oldName) {
                if (this.formId) {
                    this.getActions();
                }
            }
            // immediate: true
        }
    },
    methods: {
        getActions() {
            let self = this;
            axios.get(`/api/v1/incomings/${this.formId}/actions`).then(res => {
                if (res.data.types.length > 0) {
                    self.$emit("setActionStatus",true);
                }else{
                     self.$emit("setActionStatus",false);  
                }
                this.actions = res.data.types;
            });
        },
        getRejectList() {
            let self = this;
            axios
                .get("/api/v1/incomings/" + this.formId + "/reject/targets")
                .then(res => {
                    self.rejectList = res.data;
                });
        },
        doAction(action) {
            this.clearForm();
            this.currentAction = action;
            // 不需要弹出框
            if ("ARCHIVE,DISPATCH,TEMPLATE,PULL,COMMIT".includes(action.type)) {
                let self = this; //套红，归档，分发
                if (action.type == "PULL") {
                    axios
                        .get(`/api/v1/incomings/${this.formId}/pull`)
                        .then(res => {
                            self.comment("formOnlyComment");
                            self.getActions();
                        });
                }
                if (action.type == "COMMIT") {
                     this.clearForm();
                     this.dialogVisible = true;
                    if (action.required) {
                        if (action.type == "COMMIT") {
                            this.presign_status = true;
                            this.seleteUserLabel = "请选择拟办人";
                        }
                    } else {
                         this.presign_status = false;
                        //self.submitForm();
                    }
                }
            } else if ("REJECT,PRESIGN".includes(action.type)) {
                //拒绝，加签
                this.dialogVisible = true;
                //需要弹出并填写意见，选择驳回节点或选择其他人
                if (action.type == "REJECT") {
                    this.getRejectList();
                    this.reject_status = true;
                }
                if (action.type == "PRESIGN") {
                    this.presign_status = true;
                    this.seleteUserLabel = "请选择前加签人";
                }
            } else if ("SUPERIOR,APPROVE,SIGNOUT".includes(action.type)) {
                //拟办，同意
                this.dialogVisible = true;
                //只需要填写意见
            }
        },
        clearForm() {
            this.reject_status = false;
            this.presign_status = false;
            this.textarea = "";
            this.submitData = {};
        },
        comment(comment) {
            let self = this;
            axios
                .put(`/api/v1/incoming_forms/${self.formId}/comment`, {
                    content: self.textarea || self.currentAction.name
                })
                .then(res => {
                    if (comment == "formOnlyComment") {
                        self.$emit("refreshFormData");
                        self.$message({
                            message: self.currentAction.name + "成功",
                            type: "success"
                        });
                    }
                });
        },
        submitForm() {
            let self = this;
            self.comment();
            //如果是不需要走流程的节点
            if (
                "SAVE,PREVIEW,COMMENT,PULL,PRINTER,EDIT".includes(
                    self.currentAction.type
                )
            ) {
            } else {
                //退回
                if (self.currentAction.type == "REJECT") {
                    if (self.seleteUsers) {
                        self.submitData.rejectTarget = self.rejectTarget;
                    } else {
                        self.$message.error("请选择驳回节点");
                        return false;
                    }
                }

                //前加签等其他必填选下个
                if (self.currentAction.required) {
                    if (self.seleteUsers.length > 0) {
                        var  key = self.currentAction.required[0].split(":")[0];
                        self.submitData[key] = self.seleteUsers;
                    } else {
                        self.$message.error(self.seleteUserLabel);
                        return false;
                    }
                }
                self.submitData.action = self.currentAction.type;
                axios
                    .put(
                        `/api/v1/incomings/${self.formId}/signal`,
                        self.submitData
                    )
                    .then(res => {
                        self.dialogVisible = false;
                        self.getActions();
                        self.$message({
                            message: self.currentAction.name + "成功",
                            type: "success"
                        });
                        self.$emit("refreshFormData");
                    });
            }
        },
        getAllUsers() {
            let self = this;
            axios.get(`/api/v1/users`).then(res => {
                self.users = res.data;
            });
        }
    },
    mounted() {
        if (this.formId) {
            this.getActions();
        }
        this.getAllUsers();
    }
};
</script>
<style lang="scss" scoped>
.btnList {
    line-height: 40px;
    padding: 12px 10px;
    cursor: pointer;
}
.btnList:hover {
    background: #c7e0f4;
}
</style>