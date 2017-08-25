/**
 * Created by Administrator on 2017/2/16.
 */
const express = require("express");
const router = express.Router();
//下面都自定模块
const index = require("./controller/index.js");
const user = require("./controller/user.js");
const article = require("./controller/article.js");
const show = require("./controller/show.js");
const project =require("./controller/project.js");

//显示首页
router.get("/",index.getIndex);
//渲染注册页面
router.get("/register",[checkLogin,user.getregister]);
//处理注册逻辑
router.post("/register",user.postregister);
//渲染登入页面
router.get("/login",[checkLogin,user.login]);
//处理登入页面逻辑
router.post("/login",user.postLogin);
//我要投资列表
router.get("/project",project.getProjectList);
//验证码
router.get("/code",user.getCode);
//用户退出
router.get("/out",user.out);
//用户设置渲染
router.get("/userSet",[noLogin,user.userSet]);
//用户名头像上传
router.post("/userMig",[noLogin,user.userMig]);
//正在热映
router.get("/showing",show.showimg);
//即将上映
router.get("/be",show.be);
//top250
router.get("/top",show.top);
//搜索
router.get("/search/:jqueryStr",show.search);


module.exports = router;

function checkLogin(req, res, next) {
    // 权限校验，已经登录的用户，就不要再访问这个页面了，直接跳转到首页就行了
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}
//没有登入的情况下
function noLogin(req,res,next){
    if(req.session.user){
        //只要登入了 才走下面
        return next()
    }
    //如果没登入  就直接去首页
    res.redirect('/');
}