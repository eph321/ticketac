var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
        
    lastname: String,
    firstname: String,
    email: String,
    password:String,
    journeys:[{type: mongoose.Schema.Types.ObjectId, ref: 'journeys'}],
    last_trips:[{String}],
     });
     
     var userModel = mongoose.model('users', userSchema);
 
     module.exports= userModel;