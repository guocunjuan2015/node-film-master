/**
 * Created by Administrator on 2017/5/20.
 */
const publish = require("./../module/project.js");


//渲染产品列表数据(全部数据)
module.exports.getProjectList = function(req,res,next){

    res.render("./project");
};



