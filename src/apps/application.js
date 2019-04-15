
export const publicMethods = {
    methods: {
        async saveFormData(url, data) {
            try {
                return await this.$axios.post(url, data);
            } catch (err) {
                return false;
            }
        },
        async getDetails() {
            try {
                return await this.$axios.get(this.url);
            } catch (err) {
                return false;
            }
        },
        async getQueryList() {
            try {
                return await this.$axios.post(this.url, this.params);
            } catch (err) {
                return false;
            }
        },
        async emitMessage() {
            if (this.createForm_status) {
                this.$emit("reloadList", "reload"); //如果是 "新建" 表单刷新 "列表"
            } else {
                this.$emit("reloadList", this.formData); //如果是 "编辑" 表单刷新 "详情页"
            }
        },
        async startSignal(actions, status) {
            if (status) {
                this.hasRequired(actions ? actions : this.currentAction);
            }
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/signal`;
            return await this.$axios.put(url, actions ? actions : this.currentAction);
        },
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
        async startSignalForStart() {
            await this.startSignalForSave("forStart");
            let actions2 = await this.getActions();
            if (actions2.data.types.length > 0) {
                actions2.data.types = actions2.data.types.filter(function (item) {
                    return item.action == "COMMIT";
                });
                this.hasRequired(actions2.data.types[0]);
            } else {
                this.msgTips("缺少action,流程启动失败", "warning");
                return false;
            }
            actions2.data.types[0]["comment"] = actions2.data.types[0].name;
            let complete2 = await this.startSignal(actions2.data.types[0]);
            await this.emitMessage();
        },
        hasRequired(data) {
            let $self = this;
            let detailsData = $self.tableData ? $self.tableData : $self.formData;
            let options = [];
            if (data.required && data.required.length > 0) {
                for (let item of data.required) {
                    let key = item.split(":")[0];
                    if (detailsData[key] || detailsData[key] == false) {
                        if (item.split(":")[1] == "arrays" && typeof (detailsData[key]) == "string") {
                            options.push(key + "=" + '[' + detailsData[key] + ']'); //如果是数组类型的拼成数组
                        } else {
                            detailsData[key] = detailsData[key] === "" ? 0 : detailsData[key];
                            options.push(key + "=" + detailsData[key]);
                        }
                    } else {
                        if (key == "oid") {
                            options.push(key + "=" + this.$store.getters.LoginData.oid);
                        }else if(key == "code"){
                             options.push(key + "="  + this.$store.getters.LoginData.code.split('_')[0]);
                        }else {
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

            if (action.assigneeList && action.assigneeList.length > 0) {
                $self.actionsDialogArr.push({
                    seletList: action.assigneeList,
                    label: action.assigneeListLabel,
                    multiple: action.assigneeListMul == "true" ? true : false,
                    checkedValue: action.assigneeListMul == "true" ? [] : "",
                    labelName: "assigneeList"
                });
            }
            if ($self.currentAction.action == 'PULL') {
                $self.currentAction["comment"] = $self.currentAction.name;
                await $self.startSignal();
                $self.msgTips($self.currentAction.name + "成功", "success");
                $self.getFormDetailsData();
            } else if ($self.currentAction.action == 'CANCEL') {
                await $self.startSignal();
                $self.deleteCurrentLine($self.tableData.id, "CANCEL");
            } else if($self.currentAction.name == "编辑"){
                $self.msgTips("开发中", "warning");
            } else if($self.currentAction.name == "打印"){
                $self.$axios
                .get("/api/v1/submission_forms/" + $self.tableData.id +"/getForm")
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
            }else {
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
                    $self.currentAction[item.labelName] = item.checkedValue;
                }
                await $self.startSignal();
                $self.getFormDetailsData();
                $self.dialogVisible = false;
                $self.msgTips($self.currentAction.name + "成功", "success");
            } else {
                if ($self.currentAction.assigneeList && $self.currentAction.assigneeList.length > 0) {
                    $self.msgTips($self.currentAction.assigneeListLabel, "warning");
                    return false;
                } else if ($self.currentAction.addAssigneeList && $self.currentAction.addAssigneeList.length > 0) {
                    $self.msgTips($self.currentAction.addAssigneeListLabel, "warning");
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
        async getActions() {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/${this.$store.getters.LoginData.uid}/actions`;
            return await this.$axios.get(url);
        },
        async getComments() {
            let url = `/workflow/${this.appFlowName}/${
                this.formId
                }/getComments`;
            return await this.$axios.get(url);
        },
        async getUsers(url) {
            return await this.$axios.get(url);
        },
        deleteCurrentLine(id, params) {
            let $self = this;
            $self.$confirm(params ? "是否撤销?" : "是否删除?", "提示", { type: "warning" }).then(() => {
                $self.$axios.get("/api/v1/" + $self.formName + "/delete/" + id).then(res => {
                    $self.msgTips(params ? "撤销成功" : "删除成功", "success");
                    if (params) {
                        $self.$emit("reloadList", "reload");
                    } else {
                        $self.getList();
                    }
                });
            });
        },
        async getFlowNode() {
            let $self = this;
            let url = `/workflow/${$self.appFlowName}/processContent`;
            let currentNodeUrl = `/workflow/${$self.appFlowName}/${$self.formId}/curActions`;
            let bpmnData = await this.$axios.get(url);
            let bpmnDataCurrent = await this.$axios.get(currentNodeUrl);
            $self.flowNodeUrl = `/bpmn-viewer/view.html?url=${bpmnData.data.resourceName}&&id=${bpmnDataCurrent.data[0].taskDefinitionKey}`;
            $self.dialogVisibleCrumb = true;
            console.log($self.flowNodeUrl);
        },
        msgTips(message, type) {
            this.$message({
                message: message,
                type: type
            });
        },
        deleteAttachments(id) {
            alert(id);
            let $self = this;
            $self.$confirm("是否删除?", "提示", { type: "warning" }).then(() => {
                $self.formData.attachments.forEach(function (value, index) {
                    $self.formData.attachments.splice(index, 1);
                    // if (value.id == id) {
                    //     axios
                    //         .get("/api/v1/incoming_forms/deleteAtt/" + id)
                    //         .then(res => {

                    //         });
                    // }
                });
            });
        },



        //以下方法关于ntko创建,以及编辑文件文件
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
                        .then(res => {
                        });
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
                $self.timer = setInterval(function () {
                    $self.$axios
                        .get("/api/v1/ntko/session/finish?token=" + res.data)
                        .then(res => {
                            if(res.data.file_name){
                                $self.formData.text = {
                                    iconUrl: res.data.icon_url,
                                    name: res.data.originalFilename,
                                    url: res.data.url,
                                    path: res.data.path,
                                    file_name:res.data.file_name,
                                    pdfUrl:
                                        res.data.url.split("files")[0] +
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