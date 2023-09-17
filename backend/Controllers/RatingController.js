const RatingReview = require('../Models/RatingAndReviewModel');
const userModel = require('../Models/userSchema');
const AppError = require('../Utils/error.utils');

const createRating = async(req, res, next)=>{
    try{
          const { rating, review, courseId} = req.body;

          const userId = req.user.id;

          console.log("rating", rating);
          console.log("review", review);
          console.log("course", courseId);
          console.log("user", userId);

          //validate data
          if(!review || !rating || !couseId || !userId){
            return next(new AppError("All fileds are required", 400))
          }

          const userDetail = await userModel.findById(email);

          //verify user details
          if(!userDetail.courses.includes(courseId)){
            return next(new AppError('user is not enrolled the course', 400))
          }


    }
    catch(err){
        return next(new AppError(err.message, 500))
    }
}

module.exports = {
                     createRating
}