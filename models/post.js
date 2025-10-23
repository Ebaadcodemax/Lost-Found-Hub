const mongoose=require('mongoose');


const postSchema=new mongoose.Schema({

type:{
    type:String,
    enum: ['Lost', 'Found'],
        required: true  
},

 title: {
        type: String,
        required: true
    },

description:{
    type:String},


location: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },

    photoUrl: {
        type:String},
    datePosted: {
        type: Date,
        default: Date.now
    },
    authorEmail: String 

})

module.exports = mongoose.model('Post', postSchema);