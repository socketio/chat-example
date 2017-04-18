var LocalStrategy = require('passport-local').Strategy
var User = require('../models/User');

module.exports = function(passport){
    mongoose.connect('mongodb://testUser:testtest@ds163020.mlab.com:63020/chat_user');
    mongoose.Promise = global.Promise;
}
