const mongoose = require('mongoose');


const TourSchema = new mongoose.Schema(
    {
        name : {type: String , required: true, unique: true},
        rating: {type : Number},
        price : Number,
    });

    const Tour = mongoose.model('Tour' , TourSchema);

module.exports = Tour;