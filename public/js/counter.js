var socketio = io.connect(location.host);
var num = 0;

socketio.on("connected",function(data){addMessage(data.value);});
socketio.on("publish", function(data){ addMessage(data.value);});
socketio.on("disconnect" , function(){});

function setAdmin(){
  socketio.on("reset", function(data){
    if(data.value){
      alert("削除されました");
    }else{
      alert("認証されていません");
    }
  });
  socketio.on("auth", function(data){
    if(data.value){
      alert("認証されました");
    }else{
      alert("認証されません");
    }
  });
}



function start() {
  socketio.emit("connected",{value:num});
}

function publishMessage(){
  socketio.emit("publish" , {value:num});
}

function auth(username,pass){
    socketio.emit("auth" , {username:username,pass:pass});
}

function reset(){
  socketio.emit("reset" , {value:num});
}

function requestAuth(){
  var user = document.forms.auth.input_user.value;
  var pass = document.forms.auth.input_pass.value;
  auth(user,pass);
}

function addMessage(msg){
  num = msg;
  var domMsg = document.getElementById('num');
  domMsg.innerHTML = num;
}
