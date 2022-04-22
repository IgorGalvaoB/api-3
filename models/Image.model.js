const { Schema, model } = require('mongoose');

const imageSchema = new Schema(
    {
        imageUrl: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
); 


module.exports = model('Image', imageSchema);