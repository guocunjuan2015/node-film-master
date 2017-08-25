/**
 * Created by guocunjuan on 2017/7/31.
 */
const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./router.js");
const cookieParser = require('cookie-parser');//cookie
const session = require('express-session');//用cookie实现
const config =  require("./config.js");

//设置模板
/*app.set("views",path.join(__dirname,"./views"));
app.set('view engine', 'xtpl');*/

//设置模板
app.set("views",path.join(__dirname,"./views"));
app.engine('.html', require('xtpl').__express);
app.set('view engine', 'html');

app.locals.key = config.key;//秘钥

// 配置解析post请求体的中间件，该中间件叫 body-parser ，可以在npm上搜索到，需要安装 npm install body-parser
// 当它解析完毕之后，就可以直接通过req.body 获取post请求体中的参数
app.use(bodyParser.urlencoded({ extended: false }));

// 挂载cookie中间件
app.use(cookieParser());


// 挂载Session中间件

app.use(session({
    secret:config.key,
    resave: false,
    saveUninitialized: true

}));

//静态资源
app.use("/www",express.static("www"));
//静态图片资源
app.use("/upload",express.static("upload"));
//静态头像资源
app.use("/headimg",express.static("headimg"));
//静态资源
app.use("/bower",express.static("bower"));


app.use(router);

//输出错误信息
if(config.bug){
    app.use(function(error,rep,res,next){
        if(error){
            console.log(error.message);
        }
    })
}
app.listen("4000","127.0.0.2",function(){
    console.log("127.0.0.2:4000");
});




