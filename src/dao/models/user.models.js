const mongoose = require("mongoose")

const collection = "Usuarios"

const schema = new mongoose.Schema({
    first_name : {type:String,required: true},
    last_name : {type:String,required: true},
    age:{type: Number,required: true},
    email: {type:String,required: true},
    password: {type:String,required: true},
    cartId : {type:Number},
    role : {type:String}
})

const userModel = mongoose.model(collection,schema)

module.exports = userModel