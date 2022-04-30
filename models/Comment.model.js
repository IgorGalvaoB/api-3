const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
    {
        by: {

            type:Schema.Types.ObjectId, ref:'User'

        },

        commentedAt:{

            type:Schema.Types.Mixed,
            
        },

        content:{

            type: String,
            required: true,
            
        },
    },
    {
        timestamps: true,
    }
); 


module.exports = model('Comment', commentSchema);