const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
});

UserSchema.path('username').validate({
  validator: function(value){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
      this.model("User").count({ username: value }, (err, count)=> {
        if(count > 0)
          resolve(false);
        else
          resolve(true);
      });
      }, 0);
    });
  },
  message: "Username already exists"
});

module.exports = mongoose.model("User", UserSchema);

