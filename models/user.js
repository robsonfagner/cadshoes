const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nome : {
        type : String,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha :{
        type: String,
        required: true
    },
    funcao :{
        type: String,
        required: true
    },
    endereco:{
        type: String,
        required: true
    }, 
    
    date: {
      type: Date,
      default: Date.now
    }
})

module.exports = mongoose.model('user', UserSchema);