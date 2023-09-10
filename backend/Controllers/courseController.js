const courseModel = require('../Models/coursemodel');
const AppError = require('../Utils/error.utils');
const fs = require('fs/promises');

// not working
const getAllCourses = async(req, res, next)=>{
       try{
           const course = await courseModel.find({}).select('-lectures');
            
           res.status(200).json({
               success: true,
               message: "All courses",
               course,
             });

       }
       catch(err){
          return next(new AppError(err.message),500);
       }

}

const getLecturesById = async(req, res, next)=>{
   
    try{
        const{ id } = req.params;

        const course = await courseModel.findById(id);
  
        if(!course){
          return next(new AppError("Invalid course id", 400));
        }
  
        res.status(200).json({
          success: true,
          message: "Course lectures fetched successfully",
          lectures: course.lectures,
  
  });
    }
    catch(err){
        return next(new AppError(e.message, 500));
    }
      
}

const createCourse = async(req, res, next)=>{
        const{title, description, category, createdBy} = req.body;
        console.log(title, description, category, createdBy);

        if(!title || !description || !category || !createdBy){
            return next(new AppError("All fields are required", 400))
        }

        const course = await courseModel.create({
            title,
            description,
            category,
            createdBy,
            thumbnail:{
                public_id: "Dummy" ,
                secur_url: "Dummy"
            }
        })

        if(!course){
            return next(new AppError("Course could not created, please try again", 500))
        }

        if(req.file){
            try{
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder: 'lms',
                    width: 100,
                    height: 100,
                    crop: 'fill'
                })

                if(result){
                    course.thumbnail.public_id = result.public_id;
                    course.thumbnail.secure_url = result.secure_url;
                }

                fs.rm(`uploads/${req.file.filename}`);
            }
            catch(err){
                  return next(new AppError(err.message, 500))
            }
        }
        await course.save();
        res.status(200).json({
            success: true,
            message: 'course created successfully',
            course
        })
}
module.exports = {getAllCourses,
                  getLecturesById,
                 createCourse};