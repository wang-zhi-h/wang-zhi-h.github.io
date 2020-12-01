(function(){
    //轮播图
    var carouselId = "gameCarousel" //容器id

    // 游戏介绍页面轮播图数据
    var carouselData = [
        {
        image: "https://game.gtimg.cn/images/lolm/m/f_1.jpg",
        },
        {
        image: "https://game.gtimg.cn/images/lolm/m/f_2.jpg",
        },
        {
        image: "https://game.gtimg.cn/images/lolm/m/f_3.jpg",
        },
        {
        image: "https://game.gtimg.cn/images/lolm/m/f_4.jpg",
        },
        {
        image: "https://game.gtimg.cn/images/lolm/m/f_5.jpg",
        },
        {
        image: "https://game.gtimg.cn/images/lolm/m/f_6.jpg",
        },
    ];

    createCarousel("gameCarousel",carouselData);

    //防止滑动滚动条时切换页面
    var container = $(".game_container");
    container.ontouchstart = function(e){
        //滑动位置不在顶部
        if(container.scrollTop >= 10){
            e.stopPropagation(); //阻止事件冒泡
        }
        
    }
})()
