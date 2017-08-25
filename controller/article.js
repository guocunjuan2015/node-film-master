/**
 * Created by Administrator on 2017/2/20.
 */
const publish = require("./../module/article.js");


//上传文件模块
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

const moment = require('moment');//时间设置


//渲染评人页面
var article = function(request,response,next){
    //没登入的情况下
    if(!request.session.user){
        return response.redirect("/");
    }
    response.render("./addArticle",{
        user:request.session.user
    });
};

//插入评价数据
var postPublish =  function(request,response,next){

    //获得数据
    var title = request.body.title;
    var content = request.body.content;
    //获得时间戳
    const time = moment().format('YYYY-MM-DD HH:mm:ss');


    var sql=  new publish({
        title,
        content,
        time,
        uId:request.session.user.username
    });

    sql.query(function(error,data){//插入数据
        if(error){
            return next(error.message);
        }
        if (!data) {
            return response.json({
                code:"0",
                info:"发布失败数据库错误"
            })
        }

        response.json({
            code:"1",
            inof:"发布成功",
            uId:request.session.user
        })
    });

};
//渲染评价数据(全部数据)
var showArticle = function(request,response,next){

    //var article = request.params.article;
/*
    //查询数据
    publish.show(article,function(error,data){
        if (error) {
            next(error.message);
        }

        console.log("没有数据的情况下");
        console.log(data);

        //查询数据失败情况下
        if(!data[0]){
            return response.json({
                code:"0"
                ,info:"查询数据失败"
            });
        }



        //获得数据
        let datas = data;




        for(let i = 0; i < datas.length; i++) {
            datas[i].content = md.render(datas[i].content);//把里面的数据格式化一下
        }

        //把数据格式化
        return response.render("./index",{
            user:request.session.user,
        });
    });*/

};
//上传文件
var upload = function(req,response,next){

    var form = new formidable.IncomingForm();
    //把文件放到这里
    form.uploadDir = "./upload";//这个路径是以app.js  为路径 启示录


    form.parse(req, function(err, fields, files) {
        if (err) {
            return res.json({
                code: '0',
                msg: 'failed'
            });
        }




        let pic = files.file;//这个file是前端传过来的键
        let tmpPath = pic.path;//获得路径
        let size = pic.size;//获得文件大小
        let name = pic.name;//获得文件名

        let newPath = tmpPath + path.extname(name);//评介文件

        //把文件拷贝 原来的路径下  并且加上后缀名
        fs.rename(tmpPath, newPath, function () {
            // 将该图片的请求路径响应给客户端就行了



            response.json({//响应给前端
                code: '1',
                inof: `/upload/${path.basename(newPath)}`
            });

        });
    });

};

module.exports  = {postPublish,article,showArticle,upload};