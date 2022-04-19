const { Schema, model } = require('mongoose');

const User = new Schema(
    {
        name: {
            type: String,
        },
        username:{
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        posts: [{ 
            type: Schema.Types.ObjectId, ref: 'Post' 
        }],
        avatarImage:{ 
            type: Schema.Types.ObjectId, ref: 'Image' 
        },
        coverImage:{
            type: Schema.Types.ObjectId, ref: 'Image'
        },
        images:[{
            type:Schema.Types.ObjectId, ref: 'Image'
        }],
        friends: [{
            type:Schema.Types.ObjectId, ref: 'User'
        }],
        requestFriends:[{
            type:Schema.Types.ObjectId, ref: 'User'
        }]
    },
    {
        timestamps: true,
    }
); 


module.exports = model('User', User);