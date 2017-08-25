/**
 * Created by Administrator on 2017/2/25.
 */
module.exports.showimg = function(req,res,next){
    res.render("showing",{
       user: req.session.user
    });
};
module.exports.be = function(req,res,next){
    res.render("be",{user:req.session.user});
};

module.exports.top = function(req,res,next){
    res.render("top",{user:req.session.user});
};
module.exports.search = function(req,res,next) {

    let jqueryStr = req.params.jqueryStr;
    res.render("search",{user:req.session.user,
                            jquerystr:jqueryStr
    });
};