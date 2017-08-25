var express = require('express');

var app = express();

var Router = express.Router();


app.use("/www",express.static("www"));


 app.get('/',function(req,res){

 	res.end('Hello\n');

 })

 


app.listen(8888,function afterListen(){

	console.log("server running http://localhost:8888");
});