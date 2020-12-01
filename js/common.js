// 全局通用的一些函数或一开始要执行的全局代码

function $(selector) {
    return document.querySelector(selector);
}


function $$(selector) {
    return document.querySelectorAll(selector);
}


// 调用函数返回视口宽高
function width(){
    return document.documentElement.clientWidth;
}

function height(){
    return document.documentElement.clientHeight;
}


//轮播图（不同样式的都会用所以放通用js）
var carouselId = "newsCarousel" //容器id

//轮播图数据
var datas = [
    {
        link:
          "https://lolm.qq.com/m/news_detail.html?docid=8584324486918752329&amp;e_code=492513&amp;idataid=279688",
        image:
          "https://ossweb-img.qq.com/upload/adw/image/20191015/80cbdbaff4a1aa009f61f9240a910933.jpeg",
      },
      {
        link:
          "https://lolm.qq.com/m/news_detail.html?docid=13355407427466544705&amp;e_code=492506&amp;idataid=279689",
        image:
          "https://ossweb-img.qq.com/upload/adw/image/20191015/696545e262f2cbe66a70f17bf49f81e0.jpeg",
      },
      {
        link:
          "https://lolm.qq.com/m/news_detail.html?docid=15384999930905072890&amp;e_code=492507&amp;idataid=279690",
        image:
          "https://ossweb-img.qq.com/upload/adw/image/20191018/3c910d44898d7221344718ef3b7c0a7e.jpeg",
      }
];

//创建轮播图区域
function createCarousel(carouselId,datas){
    var container = document.getElementById(carouselId);
// 从id指定container容器中选择各种dom元素
var carouselList = container.querySelector(".g_carousel-list");
var indicator = container.querySelector(".g_carousel-indicator");
var prev = container.querySelector(".g_carousel-prev");
var next = container.querySelector(".g_carousel-next");

var curIndex = 0;//当前显示的图片索引

//创建轮播图中的各种元素
function createCarouselElements(){
    var listHtml = "" //轮播图内部的html
    var indHtml = "" //指示器内部的HTML
    for(var i = 0; i < datas.length; i++){
        var data = datas[i];
        if(data.link){
            //有超链接
            listHtml += `<li>
            <a href="${data.link}" target="_blank">
                <img src="${data.image}"> 
            </a>
            </li>`;
        }
        else{
            listHtml += `<li>
                <img src="${data.image}"> 
            </li>`;
        }
        indHtml += "<li></li>";
    }
    carouselList.style.width = `${datas.length}00%`; 
    carouselList.innerHTML = listHtml;
    indicator.innerHTML = indHtml;
}

createCarouselElements();



//根据目前的索引设置正确的状态
function setStatus(){
    carouselList.style.marginLeft = -curIndex * width() + "px";
    
    //设置指示器状态
    //取消之前的selected
    var beforeelected = indicator.querySelector(".selected")
    if(beforeelected){
        beforeelected.classList.remove("selected");
    }
    indicator.children[curIndex].classList.add("selected");

    //处理之前和之后
    if(prev){//有这个div
        //目前是第一张图
        if(curIndex === 0){
            prev.classList.add("disabled");//不可用样式
        }
        else{
            prev.classList.remove("disabled");
        }
    }

    if(next){
        //目前是最后一张图
        if(curIndex === datas.length-1){
            next.classList.add("disabled");//不可用样式
        }
        else{
            next.classList.remove("disabled");
        }
    }
}
setStatus();


//去上一个
function toPrev(){
    if(curIndex === 0){
        return;//没有上一个
    }
    curIndex--;//图片索引减一
    setStatus();//根据索引设置显示位置
}


//去下一个
function toNext(){
    if(curIndex === datas.length - 1){
        return; // 没有下一个
    }
    curIndex++;
    setStatus();
}



var timer = null;//设置一个计时器
//开始自动切换
function start(){
    if(timer){
        // 已经再切换了
        return;
    }
    timer = setInterval(function(){
        curIndex++;//图片索引每隔2秒++
        if(curIndex === datas.length){
            //索引加到最后再从头开始
            curIndex = 0;
        }
        setStatus();
    }, 2000)
}


//停止自动切换
function stop(){
    clearInterval(timer);//内置函数停止计时器
    timer = null;//把timer置为空
}

start();

//事件
if(prev){
    // 容器里有prev这个div点击触发函数
    prev.onclick = toPrev;
}

if(next){
    // 容器里有next这个div点击触发函数
    next.onclick = toNext;
}

//横向滑动
container.ontouchstart = function(e){
    e.stopPropagation();//阻止时间冒泡

    var x = e.touches[0].clientX;//记录按下的坐标
    //按下准备横向拖动就停止自动播放
    stop();
    //拖动的时候不需要动画
    carouselList.style.transition = "none";

    var pressTime = Date.now();//手指按下的时间

    //监听移动事件
    container.ontouchmove = function(e){
        var dis = e.touches[0].clientX - x;
        carouselList.style.marginLeft = -curIndex * width() + dis +"px";
    }

    //放手后
    container.ontouchend = function(e){
        var dis = e.changedTouches[0].clientX - x;
        start();//放手后开启自动播放
        //放手后加入动画
        carouselList.style.transition = "";
        //不在监听
        container.ontouchmove = null;

        //滑动的时间 = 手指放开时间 - 按下的时间
        var duration = Date.now() - pressTime

        //快速滑动
        if(duration < 300){
            //300毫秒内滑动至少20px
            if(dis > 20 && curIndex > 0){
                toPrev();
            }
            else if(dis < -20 && curIndex < datas.length - 1){
                toNext();
            }
            else{
                setStatus();
            }
        }
        else{
            if(dis < -width() / 2 && curIndex < datas.length - 1){
                //当前不是最后一页，且向右拖动的距离大于屏幕一半
                toNext();
            }
            else if(dis > width() / 2 && curIndex > 0){
                toPrev();
            }else{
                setStatus();
            }
        }
        
        
    }
};
}

//ajax请求
async function ajax(url) {
    var reg = /http[s]?:\/\/[^/]+/;
    var matches = url.match(reg);
    if (matches.length === 0) {
      throw new Error("invalid url");
    }
    var target = matches[0];
    var path = url.replace(reg, "");
    return await fetch(`https://proxy.yuanjin.tech${path}`, {
      headers: {
        target,
      },
    }).then((r) => r.json());
  }