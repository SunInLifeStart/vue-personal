//import {export_json_to_excel} from './Export2Excel';
export default {
    async saveFormData(url,data,self){
        try {
            return await self.$axios.post(url, data);
          } catch (err) {
            return false;
          }
    },
    async getDetails(self){
        try {
            return await self.$axios.get(self.url);
          } catch (err) {
            return false;
        }
    },

    async startSignalForSave(self) {
        let actions = await this.getActions(self);
        let complete = await this.startSignal(self,actions.data.types[0]);
        await self.emitMessage(self);
    },
    async startSignalForStart(self) {
        let actions = await this.getActions(self);
        let complete = await this.startSignal(self,actions.data.types[0]);
        let actions2 = await this.getActions();
        actions2.data.types = actions2.data.types.filter(function(item) {
                return item.action == "COMMIT";
        });
        actions2.oid = self.$store.getters.LoginData.oid;
        let complete2 = await this.startSignal(actions2.data.types[0]);
        await this.emitMsg(self);
    },
    async getActions(self) {
        return await self.$axios.get(self.actionsUrl);
    },
    async startSignal(self,action) {
        return await self.$axios.put(self.signalUrl, action ? action : self.currentAction);
    },
    async emitMessage(self) {
        if (self.createForm_status) {
            self.$emit("reloadList", "reload"); //如果是 "新建" 表单刷新 "列表"
        } else {
            self.$emit("reloadList", self.formData); //如果是 "编辑" 表单刷新 "详情页"
        }
    },
    getUsers(self) {
        self.$axios.get("/api/v1/users").then(res => {
            // $self.users = res.data;
        });
    },
    msgTips(self,message,type){
        self.$message({ 
            message: message,
            type: type
          }); 
    },
    async getQueryList(self){
        try {
            return await self.$axios.post(self.url,self.params);
          } catch (err) {
            return false;
        }
    },



    
};