var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var port = process.env.PORT || 3000;

var User = require('./models/User');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(bodyparser.urlencoded({ extended: false}));

mongoose.connect('mongodb://testUser:testtest@ds163020.mlab.com:63020/chat_user');
mongoose.Promise = global.Promise;

app.get('/signup', function(req, res){
  res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', function(req, res){

  var salt = bcrypt.genSaltSync(12);
  var hash = bcrypt.hashSync(req.body.password, salt);
  
  var newUser = User({
    username : req.body.username,
    email : req.body.email,
    password : hash
  });

  newUser.save(function(err){
    if (err) throw err;

    console.log('person saves!');
  });

  res.send('Registration success!');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname+'/login.html');
});

app.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username:username}, function(err, obj){

    if (bcrypt.compareSync(password, obj.password)){
      console.log('log in success!');
    }  else{
      console.log('log in fail!');
      console.log(obj.password, password);
    }
  });
  /*if (User.findOne({username:username}).count()==1){
    if(bcrypt.compareSync(hash, User.findOne({username:username}).password)){
      res.sendFile(__dirname + '/index.html');
    } else{
      res.sendFile(__dirname + '/login.html');
    }
  } else {
    res.sendFile(__dirname + '/login.html');
  }*/
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});