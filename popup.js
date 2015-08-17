
(function() {

    var storage = window.localStorage;
    var storageName = "RollToLearn";

    var $ = function (id) {
        return document.getElementById(id);
    };

    function getValue(id){
        return $(id).value;
    }
    //逻辑操作
    $('sub').addEventListener('click', function () {
        var banWeb = getValue('banWeb');
        var rollToWeb = getValue('rollToWeb');
        var tip=$("tip");
        tip.childNodes[0].nodeValue=" ";
        if(banWeb==rollToWeb){
            tip.childNodes[0].nodeValue="网址不能相同！";
            tip.style.color="red";
            return false;
        }
        if(Model.find(banWeb)){
            tip.childNodes[0].nodeValue="该网址已被禁用！";
            tip.style.color="red";
            return false;
        }
        if(!is_website(banWeb)||!is_website(rollToWeb)){
            tip.childNodes[0].nodeValue="网址格式不正确（http|https://www.xxx.com）";
            tip.style.color="red";
            return false;
        }
        var webInfo = {
            banWeb: banWeb,
            rollToWeb: rollToWeb
        };
        //存入localStorage
        if (Model.save(webInfo, storageName)) {
            document.getElementsByTagName("table")[0].innerHTML="";
            WebList();
        } else {
            alert('had it!');
        }
    });
    function a(){
       // alert(document.getElementsByTagName("table")[0].getElementsByTagName("button"));
        var deleteBtn=document.getElementsByTagName("table")[0].getElementsByTagName("button");
            for(var i=0;i<deleteBtn.length;i++){
                deleteBtn[i].onclick= function () {
                    var banweb=this.getAttribute("website");
                    Model.delete(banweb);
                    document.getElementsByTagName("table")[0].innerHTML="";
                    WebList();
                }
            }


    }

    function init(){
        WebList();
    }
    function WebList(){
        var list=$("webList");
        var data=Model.getAll(storageName);
        if(data==""||!data){
            list.style.display="none";
            return false;
        }
        list.style.display="block";
        var len=data.length;
        console.log(len);
        for(var i=0;i<len;i++){
            var table=document.getElementsByTagName("table")[0];
            var tr=document.createElement("tr");
            var tdWeb=document.createElement("td");
            var tdWebTxt=document.createTextNode(data[i].banWeb);
            tdWeb.appendChild(tdWebTxt);
            var tdBtn=document.createElement("td");
            var btn=document.createElement("button");
            btn.setAttribute("class","button button-glow button-rounded button-caution");
            btn.setAttribute("website",data[i].banWeb);
            var btnTxt=document.createTextNode("X");
            btn.appendChild(btnTxt);
            tdBtn.appendChild(btn);
            tr.appendChild(tdWeb);
            tr.appendChild(tdBtn);
            table.appendChild(tr);
        }
a();
    }

    //数据操作
    var Model = {
        save: function (val, stoName) {
            var webs = [];
            if (Model.getAll(stoName)) {
               // console.log(Model.find(val, stoName));
                if (Model.find(val, stoName)) {
                    return false;
                }
                webs = Model.getAll(stoName);
                webs.push(val);
            } else {
                webs[0] = val;
            }
            storage.setItem(stoName, JSON.stringify(webs));
            return true;

        },
        delete: function (val) {
              var webs=Model.getAll(storageName);
              var newWebs=[];
                for(var i=0;i<webs.length;i++){
                    if(webs[i].banWeb!=val){
                       newWebs.push(webs[i]);
                    }
                }
            storage.setItem(storageName, JSON.stringify(newWebs));
        },
        clearAll: function () {
            storage.removeItem(val);
        },
        getAll: function (stoName) {
            var webs = JSON.parse(storage.getItem(stoName));
            if (webs) {
                return webs;
            }
            return false;  //
        },
        find: function (val) {
            var web = Model.getAll(storageName);
            console.log(web);
            if (web) {
                for (var i = 0; i < web.length; i++) {
                    if (web[i].banWeb==val) {   //判重规则，后期改进
                        return web[i];
                    }
                }
            }
            return false;
        }
    };
    function is_website(site_value){ //校验网址是否正确
        var strRegex = "[a-zA-z]+://[^\s]*";
        var re=new RegExp(strRegex);
        if (re.test(site_value)){
            return true;
        }else{
            return false;
        }
    }

    init();

})();

