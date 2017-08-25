/**
 * Created by Administrator on 2017/2/18.
 */

var captchapng = require("captchapng");
const modules = require("./../module/user.js");
const utility = require('utility');

const path = require("path");
const fs = require("fs");
//上传文件模块
const formidable = require("formidable");

//渲染注册页面
module.exports.getregister = function(req,res,next){

    res.render("register");
};

//注册逻辑处理
module.exports.postregister = function(req,res,next){
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let code = req.body.code;
    let select = req.body.select;
    let img = "/www/img/user/avatar.png";
    if (password == "") {
      return  res.json({
            code:"001"//密码为空
        })
    }
    else if(username == ""){
        return res.json({
           code:"002"//用户名为空
        });

    }
    else if(code == ""){
       return res.json({
           code:"003" //验证码为空
       });

    }
    if (!select) {
   return  res.json({
          code:"004" //协议没同意
      })
    }

    //判断验证码是否正确
    if(req.session.vcode != code){

     return   res.json({
            code:"005"//验证码错误
        })
    }

    //password = utility.md5(utility.md5(password + req.app.locals.key));
	password=utility.sha1(password);

    //插入数据
    modules.isusername(username,function(error,data){
        if(error){
          return  next(error);
        }
        if(data[0]){
        return    res.json({
                code:"006"//用户名已经存在
            })
        }

        //如果用户名没有  就插入数据
        modules.insertdata(username,password,email,img,function(error,results){

            if(error){
                res.json({
                    code:"007"//插入失败
                });
                return next(error);
            }

            //查询数据  是存在
            modules.isusername(username,function(error,data) {
                if(error)
                {
                   return next(error);
                }
                if(!data){
                    return res.json({
                        code:"007"//数据插入失败
                    });
                }

                req.session.user = data[0];

                if(!results){
                    res.json({
                        code:"000"//插入成功
                    })
                }
            });




        });

    })

};
//用户登入渲染
module.exports.login = function(req,res,next){
    res.render("login");
};
//用户登入逻辑
module.exports.postLogin = function(requir,response,next){

    //得到数据
    let susername = requir.body.username;
    let password = requir.body.password;
    let re = /\s+/;
    //在服务端 也要验证一下 密码和用户名是否为空
    if (re.test(susername) || re.test(password)) {
        return response.json({
            code:"0",
            info:"用户或密码不能为空"
        })
    }

    //password = utility.md5(utility.md5(password + requir.app.locals.key));
    password=utility.sha1(password);
    //查询是否有这个用户名
    modules.isusername(susername,function(error,data){
        if (error) {
            return  next(error);
        }

        if (!data[0]) {//如果没有用户名 情况下
            return response.json({
                code:"0",
                inof:"用户名错误"
            })
        }


        //看看密码是否匹配
        if(data[0].password !== password){
            return response.json({
                code:"0",
                inof:"用户密码错误"
            })
        }

        //到这里 用户登入成功
        requir.session.user = data[0];

        //返回成功信息
        response.json({
            code:"1",
            inof:"登入成功"
        });

    });

};
//请求验证码
module.exports.getCode = function(require,response,next){
    //响应验证码
    var int = parseInt(Math.random()*90000+10000);

    require.session.vcode = int+"";//记住验证码


    var p = new captchapng(120,35,int); // width,height,numeric captcha

    p.color(255, 123, 56, 200);  // First color: background (red, green, blue, alpha)

    p.color(80,30, 200, 255); // Second color: paint (red, green, blue, alpha)

    var img = p.getBase64();

    var imgbase64 = new Buffer(img,'base64');

    response.writeHead(200, {
        'Content-Type': 'image/png'
    });

    response.end(imgbase64);
};
//渲染用户设置
module.exports.userSet = function(require,response,next){

    response.render("userSet",{
        user:require.session.user
    });
};
//用户上传头像
module.exports.userMig = function(req,response,next){
    var form = new formidable.IncomingForm();
    //把文件放到这里
    form.uploadDir = "./headimg";//这个路径是以app.js  为路径 启示录


    form.parse(req, function(err, fields, files) {
        console.log("正在上传图片");
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

        let newPath = tmpPath + path.extname(name);//扩展名

        //把文件拷贝 原来的路径下  并且加上后缀名
        fs.rename(tmpPath, newPath, function () {
            // 将该图片的请求路径响应给客户端就行了

            modules.headMig(`/headimg/${path.basename(newPath)}`,req.session.user.username,function(error,data){
                if(error){
                    next(error);
                }

                console.log(data);

                //查询是否有这个用户名
                modules.isusername(req.session.user.username,function(error,data){
                    if (error) {
                        return  next(error);
                    }

                    if (!data[0]) {//如果没有用户名 情况下
                        return response.json({
                            code:"0",
                            inof:"用户名错误"
                        })
                    }

                    //到这里 用户登入成功
                    req.session.user = data[0];

                    response.json({
                        imgid:`/headimg/${path.basename(newPath)}`
                    })

                });
            });


        });
    });

};
//用户退出
module.exports.out = function(requir,response,next){

    requir.session.user = null;
    response.redirect("/");
};