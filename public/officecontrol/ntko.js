
var ntko;//控件对象

//初始化去打开文档
function init() {
                    ntko = document.getElementById("TANGER_OCX");
                    if (window.location.href.indexOf("url") > -1) {
                      if(getQueryString("token") == "print"){
                        document.getElementById("saveData").style.display = "none";
                      }
                    var url = getQueryString("url");  
                    //var result = TANGER_OCX_OBJ.SaveToURL("http://59.110.172.228/api/v1/ntko/upload", "file", "", "newdoc.doc", 0)
                    ntko.OpenFromURL(url);
                    } else {
                                        ntko.createnew("word.document");
                    }
}
function saveData() {
                   var token = getQueryString("token");
                   var returnData =  ntko.SaveToURL("/api/v1/ntko/upload", "file", 'token='+token, "正文.doc", 0);
                   if(returnData && JSON.parse(returnData).url){
                     window.close();         
                   }
}

function getQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
} 
