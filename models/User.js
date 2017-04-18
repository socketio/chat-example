var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
  
var userSchema = new Schema({
    username : {type:String,required:true,unique:true},
    email : {type:String,required:true},
    password : {type:String, required:true}
});

var User = mongoose.model('User', userSchema);

var salt = bcrypt.genSaltSync(12);

userSchema.methods.generateHash = function(password) {  
  return bcrypt.hashSync(password, salt, null);
};

userSchema.methods.validPassword = function(password) {  
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = User;