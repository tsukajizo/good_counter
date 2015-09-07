var fs = require("fs");
var auth = require('http-auth');
var port = process.env.PORT || 3000;
var mime = require("mime");
var cons = require("./const.js")
var user = cons.user;
var admin = cons.admin;

var basic = auth.basic({
        realm: "Restricted Access! Please login to proceed"
    }, function (username, password, callback) {
         callback( (username === user.username && user.pass === password));
    }
);

var server = require("http").createServer(basic,function(req,res){
  var path;
  if(req.url == '/') {
    path = './public/index.html';
  }else {
    path = './public' + req.url;
  }
  // Read File and Write
  fs.readFile(path, function (err, data) {
    if(err) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      return res.end(req.url + ' not found.');
    }
    var type = mime.lookup(path);
    res.writeHead(200, {"Content-Type": type});
    res.write(data);
    res.end();
  });
}).listen(port);

var io = require("socket.io").listen(server);
var userHash = {};
var num = 0;
io.sockets.on("connection", function(socket){
  var admin_user = "";
  var admin_pass = "";

  socket.on("connected",function(data){
    admin_user = "";
    admin_pass = "";
    io.sockets.emit("connected", {value:num});
  });

  socket.on("publish", function(data){
    num++;
    io.sockets.emit("publish", {value:num});
  });

  socket.on("disconnect", function(){
    admin_user = "";
    admin_pass = "";
  });

  ///////////////////
  //   admin 機能


  socket.on("auth", function(data){
    if(data.username == admin.username && data.pass == admin.pass){
      admin_user = data.username;
      admin_pass = data.pass;
      io.sockets.emit("auth", {value:true});
    }else{
      admin_user = "";
      admin_pass = "";
      io.sockets.emit("auth", {value:false});
    }

  });

  socket.on("reset", function(data){

    if(checkAdmin()){
      num = 0;
      io.sockets.emit("reset", {value:true});
      io.sockets.emit("publish", {value:num});
    }else{
      io.sockets.emit("reset", {value:false});
    }
  });

  function checkAdmin(){
    return (admin_user == admin.username && admin_pass == admin.pass)
  }
});
