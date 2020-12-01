var showPage = (function(){
    var pageIndex = 0;//当前显示的页面索引
    var pages = $$(".page_container .page");//拿到所有的页面page元素
    var nextIndex = null;//下一页面的索引
    console.log(pages);

    //设置静止状态下的各种格式
    function setStatic(){
        nextIndex = null//静止页面下没有下一个索引
        for(var i = 0; i<pages.length; i++)
        {
            var page = pages[i];//一个页面一个页面去设置
            if(i === pageIndex){
                // 这个页面就是当前页面
                page.style.zIndex = 1;
            }else{
                page.style.zIndex = 10;
            }
            //位置
            page.style.top = (i-pageIndex) * height() +"px";
        }

    }
    setStatic();

    //移动中  （dis）移动的偏移量
    function moving(dis){
        for(var i = 0; i<pages.length; i++)
        {
            var page = pages[i];//一个页面一个页面去设置
            if(i !== pageIndex)
            {
                //设置位置
                page.style.top = (i-pageIndex) * height() + dis + "px";
            }
        }

        //设置下一个页面
        //偏移量大于0往下移动  且不是最上面的页面
        if(dis>0 && pageIndex>0){
            nextIndex = pageIndex - 1
        }
        //偏移量小于0往上移动  且不是最下面的页面
        else if(dis<0 && pageIndex<pages.length - 1){
            nextIndex = pageIndex + 1
        }
        else{
            nextIndex = null;
        }

    }


    //移动完成
    function finishMove(){
        if(nextIndex ===null){
            //没有下一个
            setStatic();
            return;
        }
        var nextPage = pages[nextIndex];//下一个页面
        nextPage.style.transition = "0.5s";
        nextPage.style.top = 0;

        setTimeout(function(){
            //完成后当前页面变了需要改变index变成当前值才有下一次调用
            //就是静止状态下pageIndex的top值为0之类的
            pageIndex = nextIndex;//把之前的nextIndex赋值到当前
            //动画完了 初始状态没有transition，所以要去掉
            nextPage.style.transition = "";
            setStatic();
        },500)
    }



    //事件
    var pageContainter = $(".page_container");
    pageContainter.ontouchstart = function(e) {
        //类似于mousedown  表示手指按下
        var y = e.touches[0].clientY

        function handler(e){
            var dis = e.touches[0].clientY - y;
            //防误触
            if(Math.abs(dis) < 20) {
                dis = 0; //相当于没动
            }
            moving(dis);  
            if (e.cancelable) { // 如果事件可以取消
                e.preventDefault(); // 取消事件 - 阻止默认行为
            } 
        }
        //手指按下，监听移动
        pageContainter.addEventListener("touchmove", handler,{
            passive: false, // 指示浏览器：我的事件处理函数中有可能要取消默认行为
        });

        //手指松开完成移动
        pageContainter.ontouchend = function(){
            finishMove();
            //手指松开后，就不用监听移动了
            pageContainter.removeEventListener("touchmove",handler);
        };
        
    };


    //自动切换到某个页面（借由finshMove实现）
    //index：页面索引
    function showPage(index){
        //移动完成（finishMove（））的实现:通过手指滑动获取nextIndex
        //在把nextIndex的页面top设置为0  

        //为了防止页面过多时，两个页面距离太远滑动距离和时间久
        //实现：把当前页面上面（或下面）的所有页面变为临近页面，滑动距离只要一页
        var nextPage = pages[index];//下一个页面元素
        if(index < pageIndex){
            // 下一个页面在当前页面上面，滑动负的页面高度
            nextPage.style.top = -height() + "px";
        }
        // 下一个页面在当前页面下面，滑动正的页面高度
        else if(index > pageIndex){
            nextPage.style.top = height() + "px";
        }
        // 下个页面就是当前页面，如果要一个滑动效果
        // 把自身页面变为临近页再拉回来
        else{
            //当前页面就是第一页
            if(pageIndex === 0){
                pageIndex++;//把索引变成下一页
                setStatic();//重新设置位置，就实现了把页面变成下一页
            }
            else{
                pageIndex--;//把索引变成上一页
                setStatic();//重新设置位置，就实现了把页面变成上一页
            }
        }
        // 实现滑动效果主要是改变top值实现的 top:0-->667-->0
        // 但是浏览器的渲染较慢，由于实际变化为0，所以很难看出效果
        // 所以我们强行让浏览器渲染    
        // 在浏览器中读取dom的宽高,尺寸,位置，都会使该元素被强行渲染
        nextPage.clientHeight; //获取高度  也可以使用定时器

        nextIndex = index; //把索引设置成nextIndex
        finishMove();
    }
    return showPage;
})()