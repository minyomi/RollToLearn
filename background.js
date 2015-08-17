chrome.tabs.getSelected(function(tab) {  //选择tab时被调用
    var web=search(tab.url);
    if(web){
        chrome.tabs.remove(tabId);
        chrome.tabs.create({url:web.rollToWeb,selected:true});
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var web=search(tab.url);
    if(web){
        chrome.tabs.remove(tabId);
    chrome.tabs.create({url:web.rollToWeb,selected:true});
    }
});



function search(val) {  //检索
        var web=get("RollToLearn");
        var exp=new RegExp("\\.\.*\\.");
        var regVal=exp.exec(val);
        if(web){
            for(var i=0;i<web.length;i++){
                if(web[i].banWeb.indexOf(regVal)!=-1){   //判重规则，后期改进
                    return web[i];
                }
            }
        }
        return false;
    }
function get(){  //获取保存的网址
    var webs=JSON.parse(window.localStorage.getItem("RollToLearn"));
    if(webs){
        return webs;
    }
    return false;  //
}