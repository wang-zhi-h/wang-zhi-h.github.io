//使用这种方式可以选择需要污染全局的函数
var showPop = (function (){
    // 弹出窗口
    function showPop(id){
        var container = $("#" + id);
        $("#" + id).style.display="";
        //对有视频特殊处理
        if(id === "popVideo"){
            var vdo = container.querySelector("video");
            vdo.play();
        }
    }


    // 获取所有的关闭按钮 
    // 并在点击时获取父元素的父元素（弹窗容器）并把样式隐藏
    var closes = $$(".pop_close")
    for(var i = 0; i < closes.length; i++)
    {
        closes[i].onclick = function(){
            var container = this.parentElement.parentElement
            container.style.display = "none"
        }
    }

    //处理一些特殊的东西
    var popwx = $(".pop_wx")
    var popqq = $(".pop_qq")
    popwx.onclick = function(){
        popwx.classList.add("selected")
        popqq.classList.remove("selected")
    }

    popqq.onclick = function(){
        popqq.classList.add("selected")
        popwx.classList.remove("selected")
    }

    //处理关闭视频时视频后台停止播放
    var closebtn = $("#popVideo .pop_close");
    //关闭按钮再前面已经注册过事件
    //再使用onclick会把之前的覆盖掉，所以选择添加事件
    closebtn.addEventListener("click",function(){
        $("#popVideo video").pause();
    })
    return showPop;
})();
