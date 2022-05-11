const { Schema, model } = require('mongoose');

const conversationSchema = new Schema({

    user:{

        type: Schema.Types.ObjectId, ref: 'User',
        required:true,

    },
    conversationWith:{

        type: Schema.Types.ObjectId, ref: 'User',
        required:true,

    },
    messages:[{

        type: Schema.Types.ObjectId, ref: 'Message',

    }],
    lastMessage:{

        type: Schema.Types.ObjectId, ref: 'Message',

    }
    },
    {
        timestamps: true,
    });

module.exports = model('Conversation', conversationSchema);