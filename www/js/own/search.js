/**
 * Created by Administrator on 2017/2/16.
 */
jQuery(document).ready(function ($) {
    //设置
    $("#head .next .setall").mousemove(function(){
        $("#head .next .set").show();
        $("#head .next .out").show();
    });
    $("#head .next .setall").mouseout(function(){
        $("#head .next .out").hide();
        $("#head .next .set").hide();
    });

    //图片延迟加载模板
    $('img').lazyload();
    $("#search-a").on("click", function () {

    });

    //搜索宽变大
    $('#search').focus(function () {//获得焦点
        $("#head").addClass("current");
        $("#head .left span").hide();
        //当窗口小于500时候 把登入相关的都关掉
        var width = $(window).width();

        if (width < 600) {
            console.log(width);
            $("#head .right").addClass("hidden-xs");
        }
    });

    $("#search").blur(function(){//失去焦点

        setTimeout(function(){
            $("#head").removeClass("current");
            $("#head .left span").show();
            $("#head .right").removeClass("hidden-xs");
        },500);
    });


    //收索电影
    $("#search-img").on("click",function(){

        var value = $("#search").val();
        if(value == "" || value == "  "){
            window.alert("不能为空或者空格");
            return
        }
        window.location.href = "/search/"+value;
    });




    //直接回车提交收索电影
   $("#submit-ti").submit(function (e) {
       e.preventDefault();
        console.log("zhongg");
        var value = $("#search").val();

        console.log(value);
        if (value == "" || value == "  ") {
            window.alert("不能为空或者空格");
            return
        }
        window.location.href = "/search/" + value;
    });

});