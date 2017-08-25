/**
 * Created by Administrator on 2017/2/20.
 */
/**
 * Created by Administrator on 2017/2/7.
 */
const mysql = require("./database.js");

function publish(publishContent){
    this.uId  =  publishContent.uId;
    this.title = publishContent.title;
    this.content = publishContent.content;
    this.time = publishContent.time;
}


publish.prototype.query = function(callback){
    mysql.query("INSERT INTO publish (uid,title,content,time)VALUES(?,?,?,?)",
        [this.uId,this.title,this.content,this.time],function(error,data){
            if (error) {
                callback(error,null);
            }
            callback(null,data);
        });
};

publish.show = function(callback){
    mysql.query("SELECT * FROM publish" ,function(error,data){
        if (error) {
            callback(error,null);
        }
        callback(null,data);
    });
};
module.exports = publish;
