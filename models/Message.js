var mongoose = require('mongoose');

var mSchema = mongoose.Schema;

var msgSchema = new mSchema({
    username : {type:String, required:true},
    msg : {type:String, required:true}
});

var Message = mongoose.model('Message', msgSchema);

module.exports = Message;