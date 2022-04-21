const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        username:{
            type: String,
            required: true,
            unique: true,
            trim:true,
            maxlength:[50,'Username must be less than 50 characters'],
            minlength:[5,'Username must be at least 5 characters']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim:true,
            validate: {
                validator: function(email) {
                  return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
                },
                message: email => `${email.value} is not a valid email!`
            },
        },
        hPassword:{
            type: String,
            required: true,
            trim:true,
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
        photos:[{
            type:Schema.Types.ObjectId, ref: 'Image'
        }],
        friends: [{
            type:Schema.Types.ObjectId, ref: 'User'
        }],
        requestFriends:[{
            type:Schema.Types.ObjectId, ref: 'User'
        }],
        verifyed:{
            type: Boolean,
            default: true, //mudar para false se fizer a verificação de email
        }
    },
    {
        timestamps: true,
    }
); 


module.exports = model('User', userSchema);