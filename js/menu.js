(function () {
    var divSwitch = $(".menu_switch");
    var ulNav = $(".menu_nav"); //导航页
    console.log(divSwitch);

    //切换菜单的显示状态（开就关，关就开）
    function toggleNav(){
        //divSwitch 有类样式就去掉，没有就加上
        divSwitch.classList.toggle("menu_switch--expand");
        ulNav.classList.toggle("menu_nav--expand");
    }

    divSwitch.onclick = toggleNav;

    //导航页添加监听点击事件
    ulNav.addEventListener("click",function(){
        // 能被点击说明本身已经被打开
        // 当导航页中板块被点击后页面关掉
        toggleNav();
    })
})();
