//import {export_json_to_excel} from './Export2Excel';
export default {
    open(url) {
        window.open(
            url,
            null,
            `height=${window.screen.height},width=${
            window.screen.width
            },status=yes,toolbar=no,menubar=no`
        );
    },
    preview(file) {
        //let src = "59.110.172.228:8012";
        let src2 = "http://116.117.157.232";
        if (process.env.NODE_ENV === 'production') {
            //src = 'thumb1.zgcgroup.vpn:8012';
            // src2 = "http://work.zgcgroup.vpn";
        }
        if(!file.type){
            file.type = file.url.substring(file.url.lastIndexOf('.')+1,file.url.length).toUpperCase();
        }
        
        let url='';
        if('DOC,DOCX,PPT,PPTX,XLS,XLSX,PDF'.includes(file.type.toUpperCase())){
         //  url = "http://172.16.3.44/op/view.aspx?src=" +  encodeURI(src2 + file.url);
         url = src2 + file.url;
        }else{
            url = src2 + file.url;
        }

        window.open(
            url,
            null,
            `height=${window.screen.height},width=${
            window.screen.width
            },status=yes,toolbar=no,menubar=no`
        );
    },
    download(url, name) {
        // let iframe = document.createElement('iframe');
        // iframe.src = url;
        // iframe.style.width = 0;
        // iframe.style.height = 0;
        // iframe.style.display = 'none';
        // document.body.appendChild(iframe);

        var a = document.createElement("a"); // 生成一个a元素
        var params = { bubbles: false, cancelable: false };
        var event = document.createEvent('MouseEvent');
        event.initMouseEvent("click", params.bubbles, params.cancelable, window, 0, params.screenX || 0, params.screenY || 0, params.clientX || 0, params.clientY || 0, false, false, false, false, 0, null);
        //var  event = new MouseEvent("click");
        a.download = name || "";
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件

    },
    downloadFiles(url, item) {
        var a = document.createElement("a"); // 生成一个a元素
        var params = { bubbles: false, cancelable: false };
        var event = document.createEvent('MouseEvent');
        event.initMouseEvent("click", params.bubbles, params.cancelable, window, 0, params.screenX || 0, params.screenY || 0, params.clientX || 0, params.clientY || 0, false, false, false, false, 0, null);
        var event = new MouseEvent("click");
        a.download = item.name;
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件

    },
    downloadExport(url) {
        var a = document.createElement("a"); // 生成一个a元素
        var params = { bubbles: false, cancelable: false };
        var event = document.createEvent('MouseEvent');
        event.initMouseEvent("click", params.bubbles, params.cancelable, window, 0, params.screenX || 0, params.screenY || 0, params.clientX || 0, params.clientY || 0, false, false, false, false, 0, null);
        //var  event = new MouseEvent("click");
        //a.download = item.name;
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件

    },
    json2xlsx(th, jsonData, defaultTitle) {
        console.log(th, jsonData, defaultTitle);
    },
    insertAtCursor(f, value, callback) {
        /* eslint-disable */
        let field = f
        let newValue = ''
            // IE support
        if (document.selection) {
            field.focus()
            const sel = document.selection.createRange()
            sel.text = newValue = value
            sel.select()
        } else if (field.selectionStart || field.selectionStart === 0) {

            const startPos = field.selectionStart
            const endPos = field.selectionEnd
            const restoreTop = field.scrollTop
            newValue = field.value.substring(0, startPos) +
                value +
                field.value.substring(endPos, field.value.length)
            if (restoreTop > 0) {
                field.scrollTop = restoreTop
            }
            field.focus()
            setTimeout(() => {
                field.selectionStart = startPos + value.length
                field.selectionEnd = startPos + value.length
            }, 0)
        } else {
            newValue = field.value + value
            field.focus()
        }
        f.value = newValue;
        callback(newValue)
    },
    //打印
    printContent(id) {
        let outputDom = document.getElementById(id);
        let newContent = outputDom.innerHTML;
        let oldContent = document.body.innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        window.location.reload();
        document.body.innerHTML = oldContent;
        return false;
    },
    exportData() {
        axios({ // 用axios发送post请求
                method: 'post',
                url: '/api/v1', // 请求地址
                data: [],
                responseType: 'blob' // 表明返回服务器返回的数据类型
            })
            .then((res) => { // 处理返回的文件流
                const content = res.data
                const blob = new Blob([content])
                const fileName = 'test.xls'
                if ('download' in document.createElement('a')) { // 非IE下载
                    const elink = document.createElement('a')
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else { // IE10+下载
                    navigator.msSaveBlob(blob, fileName)
                }
            })
    },
    //保留2位
    toDecimal2(x) {
        var a = parseFloat(x);
        if (isNaN(a)) {
            return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    },
    toDecimal5(x) {
        var a = parseFloat(x);
        if (isNaN(a)) {
            return false;
        }
        var f = Math.round(x * 100000) / 100000;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 5) {
            s += '0';
        }
        return s;
    },
    //保留四位
    toDecimal4(x) {
        var a = parseFloat(x);
        if (isNaN(a)) {
            return false;
        }
        var f = Math.round(x * 10000) / 10000;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 4) {
            s += '0';
        }
        return s;
    },
    //小写变大写
    DX(value) {

        var strOutput = '',
            strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
        value += '00';
        var intPos = value.indexOf('.');
        if (intPos >= 0) {
            value = value.substring(0, intPos) + value.substr(intPos + 1, 2);
        }
        strUnit = strUnit.substr(strUnit.length - value.length);
        for (var i = 0; i < value.length; i++) {
            strOutput +=
                '零壹贰叁肆伍陆柒捌玖'.substr(value.substr(i, 1), 1) +
                strUnit.substr(i, 1);
        }
        return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元')
            .replace(/亿零{0,3}万/, '亿').replace(/^元/, '零元');
    }
};