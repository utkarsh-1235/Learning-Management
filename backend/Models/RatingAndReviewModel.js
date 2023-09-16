const {model, Schema} = require('mongoose');

const RatingModel = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
         type: String,
         required: true,
         trim: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }
})

const ratingReview = new model('rating and review', RatingModel);

module.exports = ratingReview;