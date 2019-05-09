export const publicMethods = {
    methods: {
        async saveFormData(url, data) {
            try {
                return await this.$axios.post(url, data);
            } catch (err) {
                return false;
            }     
        },
        //提交时判断以什么公司名义发起
        async juderCode(){
                if(this.$store.getters.LoginData.currentRoles.length > 1){ 
                    if(this.branchCode){
                        await this.saveFormData();
                    }else{
                        this.dialogSelectCode = true;
                        this.dialogTitle = "请选择以什么公司名义发起";
                        this.currentRoles = this.$store.getters.LoginData.currentRoles;
                        this.branchCode = this.currentRoles[0].code;
                        return "returnDialog";
                    }
                }
                if(this.$store.getters.LoginData.currentRoles.length == 1){
                       this.branchCode = this.$store.getters.LoginData.currentRoles[0].code;
                       await this.saveFormData();
                }
        },
        //获取表单详情
        async getDetails() {
            try {
                return await this.$axios.get(this.url);
            } catch (err) {
                return false;
            }
        },

        //获取列表
        async getQueryList() {
            try {
                return await this.$axios.post(this.url, this.params);
            } catch (err) {
                return false;
            }
        },
        async getCommonData(url, data) {
            try {
                return await this.$axios.post(url, data);
            } catch (err) {
                return false;
            }
        },
        //刷新列表
        async emitMessage() {
            if (this.createForm_status) {
                this.$emit("reloadList", "reload"); //如果是 "新建" 表单刷新 "列表"
            } else {
                this.$emit("reloadList", this.formData); //如果是 "编辑" 表单刷新 "详情页"
            }
        },

        async getCommonType(url) {
            try {
                return await this.$axios.get(url);
            } catch (err) {
                return false;
            }
        },

        //启动工作流
        async startSignal(actions, status) {
            let $self = this;
            let nowActins = actions ? actions : $self.currentAction;
            if (status) {
                $self.hasRequired(nowActins);
            }

            //督办特殊情况特殊处理
            if($self.appFlowName == "inspect-form_inspect" && nowActins.assigneeListTos && nowActins.assigneeListTos.indexOf("assigneeListVarable") > -1){
                 let response = await $self.getCommonType("/api/v1/users/role/xtfz_deptManager");
                 if(response){
                    for(var i = 0; i<response.data.length; i++){
                        if(response.data[i].id == $self.formData.inspector){
                            nowActins.assigneeList.push({"name":response.data[i].name,"id":$self.formData.inspector});
                        }
                    };
                 }
            }
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/signal`;
            return await this.$axios.put(url, nowActins);
        },

        //保存的时候启动工作流（一次）
        async startSignalForSave(type) {
            let actions = await this.getActions();
            if (actions.data.types.length > 0) {
                this.hasRequired(actions.data.types[0]);
            } else {
                this.msgTips("缺少action,流程启动失败", "warning");
                return false;
            }
            let complete = await this.startSignal(actions.data.types[0]);
            if (!type) {
                await this.emitMessage();
            }
        },
        //提交的时候启动工作流（两次）
        async startSignalForStart(type) {
            await this.startSignalForSave("forStart");
            let actions2 = await this.getActions();
            if (actions2.data.types.length > 0) {
                actions2.data.types = actions2.data.types.filter(function(item) {
                    return item.action == "COMMIT";
                });
                this.hasRequired(actions2.data.types[0]);
            } else {
                this.msgTips("缺少action,流程启动失败", "warning");
                return false;
            }
            actions2.data.types[0]["comment"] = actions2.data.types[0].name;
            let complete2 = await this.startSignal(actions2.data.types[0]);
            if (type) {
                return complete2.data;
            } else {
                await this.emitMessage();
            }
            //return complete2.data;

        },

        //判断表单中依赖的required
        hasRequired(data) {
            let $self = this;
            let detailsData = $self.tableData ? $self.tableData : $self.formData;
            let options = [];
            if (data.required && data.required.length > 0) {
                for (let item of data.required) {
                    let key = item.split(":")[0];
                    if (detailsData[key] || detailsData[key] == false) {
                        if (item.split(":")[1] == "arrays" && typeof(detailsData[key]) == "string") {
                            options.push(key + "=" + '[' + detailsData[key] + ']'); //如果是数组类型的拼成数组
                        } else {
                            detailsData[key] = detailsData[key] === "" ? 0 : detailsData[key];
                            options.push(key + "=" + detailsData[key]);
                        }
                    } else {
                        if (key == "oid") {
                            options.push(key + "=" + this.$store.getters.LoginData.oid);
                        } else if (key == "code") {
                            if(this.branchCode){
                                options.push(key + "=" + this.branchCode);
                            }else{
                                if(this.$store.getters.LoginData.currentRoles.length == 0){
                                    options.push(key + "=" + this.$store.getters.LoginData.code.split("_")[0]);  
                                } 
                            }

                        } else if (key == "characterLevel") {
                            let type = this.$store.getters.LoginData.code.split("_")[0];
                            if (type) {
                                let arr = this.$store.getters.LoginData.Role.split(',');
                                if (arr.includes(type + "_" + "chairman")) { //董事长
                                    options.push("characterLevel=1");
                                } else if (arr.includes(type + "_" + "generalManager")) { //总经理
                                    options.push("characterLevel=2");
                                } else if (arr.includes(type + "_" + "generalManagerAssistant")) { //总经理助理
                                    options.push("characterLevel=3");
                                } else if (arr.includes(type + "_" + "duptyGeneralManager")) { //副总经理
                                    options.push("characterLevel=3");
                                } else if (arr.includes(type + "_" + "deputyGeneralManager")) { //副总经理常务
                                    options.push("characterLevel=3");
                                } else if (arr.includes(type + "_" + "deptManager")) { //部门负责人
                                    options.push("characterLevel=4");
                                } else if (arr.includes(type + "_" + "deputyManager")) { //副部门长负责人
                                    options.push("characterLevel=4");
                                } else {
                                    options.push("characterLevel=5");
                                }
                            }
                        } else if (key == "role" && detailsData.appFlowName != "travel-form_travel") {
                            options.push("role=" + this.$store.getters.LoginData.Role);
                        } else {
                            if (key.indexOf("filterButton") > -1) {

                            } else {
                                $self.msgTips('依赖的' + key + '表单中找不到', "warning");
                                return false;
                            }
                        }
                    }
                };
                if (data.options && data.options.length > 0) {
                    data.options.concat(options);
                } else {
                    if (options) {
                        data.options = options;
                    }
                }
            };
        },

        //点击审批动作
        async doAction(action) {
            let $self = this;
            $self.actionsDialogArr = [];
            if ($self.tableData && $self.appFlowName == "outgoing-form_outgoing" && JSON.stringify(action.required).indexOf("branchlineTo") > -1) { //特殊处理写死了
                $self.showCheckBox = true;
            }
            $self.currentAction = action;
            if (action.addAssigneeList && action.addAssigneeList.length > 0) {
                $self.actionsDialogArr.push({
                    seletList: action.addAssigneeList,
                    label: action.addAssigneeListLabel,
                    multiple: action.addAssigneeListMul == "true" ? true : false,
                    checkedValue: action.addAssigneeListMul == "true" ? [] : "",
                    labelName: "addAssigneeList"
                });
            }

            if (action.selContents && action.selContents.length > 0) {
                for (var i = 0; i < action.selContents.length; i++) {
                    action.selContents[i].id = action.selContents[i].value;
                };
                $self.actionsDialogArr.push({
                    seletList: action.selContents,
                    label: action.selContentsLabel,
                    multiple: action.selContentsMul == "true" ? true : false,
                    checkedValue: action.selContentsMul == "true" ? [] : "",
                    labelName: "selContents"
                });
            }
            if($self.appFlowName == "inspect-form_inspect" && action.assigneeListTos && action.assigneeListTos.indexOf("assigneeListVarable") > -1){
                $self.$axios
                .get("/api/v1/users/role/xtfz_deptManager")
                .then(res => {
                    for(var i = 0; i<res.data.length; i++){
                        if(res.data[i].id == $self.tableData.inspector){
                           action.assigneeList.push({"name":res.data[i].name,"id":$self.tableData.inspector});
                        }
                    };
                }) 
            }else{
                if (action.assigneeList && action.assigneeList.length > 0) {
                    $self.actionsDialogArr.push({
                        seletList: action.assigneeList,
                        label: action.assigneeListLabel,
                        multiple: action.assigneeListMul == "true" ? true : false,
                        checkedValue: action.assigneeListMul == "true" ? [] : "",
                        labelName: "assigneeList"
                    });
                }
            }


            //特殊的审批动作
            if ($self.currentAction.action == 'PULL') {
                $self.currentAction["comment"] = $self.currentAction.name;
                await $self.startSignal();
                $self.msgTips($self.currentAction.name + "成功", "success");
                $self.getFormDetailsData();
            } else if ($self.currentAction.action == 'CANCEL') {
                $self.deleteCurrentLine($self.tableData.id, "CANCEL");
            } else if ($self.currentAction.name == "编辑") {
                $self.reEditForm();
            }
            else if ($self.currentAction.name == "定岗定薪") {
                $self.salaryEditForm();
            }
            else if ($self.currentAction.name == "编写会议纪要") {
                $self.editMeetingSummary();
            }
             else if ($self.currentAction.name == "打印") {
                let url;
                if ($self.printerFormName == "outgoing_forms") {
                    url = "/api/v1/" + $self.printerFormName + "/getForm/" + $self.tableData.id;
                }
                if ($self.printerFormName == "submission_forms") {
                    url = "/api/v1/" + $self.printerFormName + "/" + $self.tableData.id + "/getForm";
                }
                if ($self.printerFormName == "incoming_forms") {
                    url = "/api/v1/incoming_forms/print/" + $self.tableData.id
                }

                if ($self.formName == "issuesReported") {
                    url = "/api/v1/issuesReported/print/" + $self.tableData.id
                }
                $self.$axios
                    .get(url)
                    .then(res => {
                        if (process.env.NODE_ENV === 'production') {
                            $self.openUrl = "http://124.205.31.66:2097/static/edit.html?removeBar=true&"
                        } else {
                            $self.openUrl = "http://static1.yxpe.com.cn/edit.html?removeBar=true&"
                        }
                        ntkoBrowser.openWindow(
                            $self.openUrl + "url=" + res.data
                        );
                    });
            } else {
                $self.dialogVisible = true;
            }
        },


        //提交表单
        async submitForm() {
            let $self = this;
            $self.currentAction["comment"] = $self.textarea ? $self.textarea : $self.currentAction.name;
            $self.hasRequired($self.currentAction);
            if ($self.actionsDialogArr.length > 0 && ($self.actionsDialogArr[0].checkedValue != "" || $self.actionsDialogArr[0].checkedValue.length > 0)) {
                for (let item of $self.actionsDialogArr) {
                    if (item.labelName == "selContents") {
                        if ($self.currentAction.options) {
                            for (var i = 0; i < $self.currentAction.options.length; i++) {
                                if ($self.currentAction.options[i].indexOf($self.currentAction[item.labelName][0].code) > -1) {
                                    $self.currentAction.options.splice(i, 1);
                                }
                            };
                            $self.currentAction.options.push($self.currentAction[item.labelName][0].code + "=" + item.checkedValue.value);
                        } else {
                            $self.currentAction.options = [$self.currentAction[item.labelName][0].code + "=" + item.checkedValue.value];
                        }
                    } else {
                        $self.currentAction[item.labelName] = item.checkedValue;
                    }
                }
                await $self.startSignal();
                $self.getFormDetailsData();
                $self.dialogVisible = false;
                $self.msgTips($self.currentAction.name + "成功", "success");
            } else {
                if ($self.currentAction.assigneeList && $self.currentAction.assigneeList.length > 0) {
                    if($self.appFlowName == "inspect-form_inspect"){
                        await $self.startSignal();
                        $self.getFormDetailsData();
                        $self.dialogVisible = false;
                        $self.msgTips($self.currentAction.name + "成功", "success");
                    }else{
                        $self.msgTips($self.currentAction.assigneeListLabel, "warning");
                        return false;
                    }
                } else if ($self.currentAction.addAssigneeList && $self.currentAction.addAssigneeList.length > 0) {
                    $self.msgTips($self.currentAction.addAssigneeListLabel, "warning");
                    return false;
                } else if ($self.currentAction.selContents && $self.currentAction.selContents.length > 0) {
                    $self.msgTips($self.currentAction.selContentsLabel, "warning");
                    return false;
                } else {
                    await $self.startSignal();
                    $self.getFormDetailsData();
                    $self.dialogVisible = false;
                    $self.msgTips($self.currentAction.name + "成功", "success");
                }
            }

        },
        async getCrumbs() {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/crumb`;
            return await this.$axios.get(url);
        },

        //获取动作
        async getActions() {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/actions`;
            return await this.$axios.get(url);
        },

        //获取评论
        async getComments() {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/getComments`;
            return await this.$axios.get(url);
        },
        //获取人员信息
        async getUsers(url) {
            return await this.$axios.get(url);
        },
        //删除该行
        deleteCurrentLine(id, params) {
            let $self = this;
            $self.$confirm(params ? "是否撤销?" : "是否删除?", "提示", { type: "warning" }).then(() => {
                $self.$axios.get("/api/v1/" + $self.formName + "/delete/" + id).then(res => {
                    $self.msgTips(params ? "撤销成功" : "删除成功", "success");
                    if (params) {
                        $self.startSignal();
                        $self.$emit("reloadList", "reload");
                    } else {
                        $self.getList();
                    }
                });
            });
        },
        //获取流程图
        async getFlowNode() {
            let $self = this;
            let url = `/workflow/${$self.appFlowName}/processContent`;
            let currentNodeUrl = `/workflow/${$self.appFlowName}/${$self.formId}/curActions`;
            let bpmnData = await this.$axios.get(url);
            let bpmnDataCurrent = await this.$axios.get(currentNodeUrl);
            $self.flowNodeUrl = `/bpmn-viewer/view.html?url=${bpmnData.data.resourceName}&&id=${bpmnDataCurrent.data[0].taskDefinitionKey}`;
            $self.dialogVisibleCrumb = true;
        },

        //提示消息
        msgTips(message, type) {
            this.$message({
                message: message,
                type: type
            });
        },

        //删除附件
        deleteAttachments(index,attachments,url,type) {
            let $self = this;
            $self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                if(url){
                    if(type == 'delete'){
                        $self.$axios
                        .delete(url)
                        .then(res => {
                            attachments.splice(index, 1);    
                        });
                    }
                    if(type == 'get'){
                        $self.$axios
                        .get(url)
                        .then(res => {
                            attachments.splice(index, 1);    
                        });
                    }
                }else{
                    attachments.splice(index, 1);
                }
            });
        },
        deleteAttachmentsone(index) {
            let $self = this;
            $self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                $self.formData.usingApproval[index].attachments.splice(0, 1);

            });
        },


        //以下方法关于ntko创建,以及编辑文件
        openData(url) {
            let $self = this;
            if (process.env.NODE_ENV === 'production') {
                $self.openUrl = "http://124.205.31.66:2097/static/edit.html?"
            } else {
                $self.openUrl = "http://static1.yxpe.com.cn/edit.html?"
            }

            if ($self.timer) {
                $self.clearTime();
            }
            $self.$axios.get(`/api/v1/gid`).then(res => {
                if (res.data) {
                    $self.$axios
                        .get("/api/v1/ntko/session/create?token=" + res.data)
                        .then(res => {});
                }
                if (url) {
                    ntkoBrowser.openWindow(
                        $self.openUrl + "token=" + res.data + "&url=" + url
                    );
                } else {
                    ntkoBrowser.openWindow(
                        $self.openUrl + "token=" + res.data
                    );
                }
                $self.timer = setInterval(function() {
                    $self.$axios
                        .get("/api/v1/ntko/session/finish?token=" + res.data)
                        .then(res => {
                            if (res.data.file_name) {
                                $self.formData.text = {
                                    iconUrl: res.data.icon_url,
                                    name: res.data.originalFilename,
                                    url: res.data.url,
                                    path: res.data.path,
                                    file_name: res.data.file_name,
                                    pdfUrl: res.data.url.split("files")[0] +
                                        "pdf" +
                                        res.data.url.split("files")[1]
                                };
                                $self.clearTime();
                            }
                        });
                }, 2000);
            });

        },
        openPrinter() {
            let $self = this;
            ntkoBrowser.openWindow(
                $self.openUrl + "token=print&url=" + url
            );
        },
        clearTime() {
            let $self = this;
            if ($self.timer) {
                clearInterval($self.timer);
            }
        },



        //金额阿拉伯数字转大写金额
        convertCurrency(money) {
            //汉字的数字  
            var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
            //基本单位  
            var cnIntRadice = new Array('', '拾', '佰', '仟');
            //对应整数部分扩展单位  
            var cnIntUnits = new Array('', '万', '亿', '兆');
            //对应小数部分单位  
            var cnDecUnits = new Array('角', '分', '毫', '厘');
            //整数金额时后面跟的字符  
            var cnInteger = '整';
            //整型完以后的单位  
            var cnIntLast = '元';
            //最大处理的数字  
            var maxNum = 999999999999999.9999;
            //金额整数部分  
            var integerNum;
            //金额小数部分  
            var decimalNum;
            //输出的中文金额字符串  
            var chineseStr = '';
            //分离金额后用的数组，预定义  
            var parts;
            if (money == '') { return ''; }
            money = parseFloat(money);
            if (money >= maxNum) {
                //超出最大处理数字  
                return '';
            }
            if (money == 0) {
                chineseStr = cnNums[0] + cnIntLast + cnInteger;
                return chineseStr;
            }
            //转换为字符串  
            money = money.toString();
            if (money.indexOf('.') == -1) {
                integerNum = money;
                decimalNum = '';
            } else {
                parts = money.split('.');
                integerNum = parts[0];
                decimalNum = parts[1].substr(0, 4);
            }
            //获取整型部分转换  
            if (parseInt(integerNum, 10) > 0) {
                var zeroCount = 0;
                var IntLen = integerNum.length;
                for (var i = 0; i < IntLen; i++) {
                    var n = integerNum.substr(i, 1);
                    var p = IntLen - i - 1;
                    var q = p / 4;
                    var m = p % 4;
                    if (n == '0') {
                        zeroCount++;
                    } else {
                        if (zeroCount > 0) {
                            chineseStr += cnNums[0];
                        }
                        //归零  
                        zeroCount = 0;
                        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                    }
                    if (m == 0 && zeroCount < 4) {
                        chineseStr += cnIntUnits[q];
                    }
                }
                chineseStr += cnIntLast;
            }
            //小数部分  
            if (decimalNum != '') {
                var decLen = decimalNum.length;
                for (var i = 0; i < decLen; i++) {
                    var n = decimalNum.substr(i, 1);
                    if (n != '0') {
                        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                    }
                }
            }
            if (chineseStr == '') {
                chineseStr += cnNums[0] + cnIntLast + cnInteger;
            } else if (decimalNum == '') {
                chineseStr += cnInteger;
            }
            return chineseStr;
        }
    },

};