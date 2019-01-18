const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String}
})

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function(done) {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
    // this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
    this.password = this.password;
    done();
})

mongoose.model('User', UserSchema);