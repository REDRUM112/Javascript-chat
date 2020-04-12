var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var list = [];
var clients = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
io.on('connect', function(socket){
  io.emit('chat message', 'A new user has joined the chat.');
  clients++;
    socket.on('disconnect', function () {
    io.emit('chat message', 'A user has left the chat.');
    clients--;
    });
});

io.on('connection', function(socket){
  list.forEach(element => io.emit('chat message', element));
  console.log(`There is a total of ${list.length} messages saved in the array.`)
  if (clients > 1) {
  io.emit('chat message', `You are currently chatting with ${clients-1} other people.`)
  } else {
    io.emit('chat message', `You are currently alone in the chat room.`)
  }

socket.on('chat message', function(msg){
    if (msg.name != ""){
      var time = `<span style="float:right;"> ${msg.time} </span>`;
      var color = Math.floor(Math.random()*16777215).toString(16);
      io.emit('chat message', `<b style="color:#${color};">${msg.name}</b>: ${msg.message} ${time}`);
      list.push(`<b style="color:#${color};">${msg.name}</b>: ${msg.message} ${time}`); 
    } else {
      var DefaultName = 'Guest'+Math.floor((Math.random() * 9999) + 1);
      var time = `<span style="float:right;">${msg.time}</span>`;
      var color = Math.floor(Math.random()*16777215).toString(16);
      io.emit('chat message', `<b style="color:#${color};">${DefaultName}</b>: ${msg.message} ${time}`);
      list.push(`<b style="color:#${color};">${DefaultName}</b>: ${msg.message} ${time}`); 
    }
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});