/**
 * Created by guocunjuan on 2017/4/18.
 */
"use strict";
const mysql = require("./database.js");



//是否有数据
module.exports.isusername = function(sql,callback){
    mysql.query("SELECT * FROM user WHERE username = ?",[sql],function(error,data){
        if(error){
            return callback(error,null);
        }
        callback(null,data)
    });
};
//插入数据
module.exports.insertdata = function(username,password,email,img,callback){
    mysql.query("INSERT INTO user(username,password,email,img) VALUES(?,?,?,?)",
        [username,password,email,img],
        function(error,data){
            if(error){
                return callback(error,null)
            }
            callback(error,null);
        });

};
//修改头像的图片地址
module.exports.headMig = function(id,user,cllback){
  mysql.query("UPDATE user SET img = ? WHERE username = ?;",[id,user],function(error,data){
        if(error){
            cllback(error,null);
        }
       cllback(null,data);

  })
};
