const { Schema, model } = require('mongoose');

const postSchema = new Schema(
    {
        postBy:{
            type: Schema.Types.ObjectId, ref: 'User',
            required:true,
        },
        imagesUrl: [{
            type:String,
        }],
        content:{
            type: String,
        },
        comments: [{
            type:Schema.Types.ObjectId, ref: 'Comment'
        }],
    },
    {
        timestamps: true,
    }
); 


module.exports = model('Post', postSchema);