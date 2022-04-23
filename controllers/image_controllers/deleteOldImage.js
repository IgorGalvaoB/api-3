const Image = require('../../models/Image.model.js');

const deleteOldImage = async (oldImage) => {
    try {
        
        await Image.findByIdAndDelete(oldImage)
    
    } catch (error) {
        
        error.message = "Error on delete old image";
        error.status = 500;
        throw error
        
    }
    
    return 
    
}

module.exports = deleteOldImage;