const { Schema, model } = require('mongoose');

const imageSchema = new Schema(
    
    {
        imageUrl: {
            type:String,
            required: true,
        },
        comments: [{
            type:Schema.Types.ObjectId, ref: 'Comment'
        }],
    },
    {
        timestamps: true,
    }
); 

module.exports = model('Image', imageSchema);