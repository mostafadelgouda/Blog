const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters'],
    }

})

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        console.log(user)
      const auth = await bcrypt.compare(password, user.password);
      //console.log('ana auth = ', auth)
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };

userSchema.post('save', function(doc, next) {
    console.log("new user is created and saved", doc)
    next();
})
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})
const User = mongoose.model('user', userSchema);
module.exports = User