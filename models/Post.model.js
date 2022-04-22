const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        postBy: {
            type:Schema.Types.ObjectId, ref:'User'
        },
        images: [{
            type:Schema.Types.ObjectId, ref: 'Image'
        }],
        comments: [{
            type:Schema.Types.ObjectId, ref: 'Comment'
        }],
    },
    {
        timestamps: true,
    }
); 


module.exports = model('User', userSchema);