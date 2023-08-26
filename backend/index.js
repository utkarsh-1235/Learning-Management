const app = require('./app')
const dbConnect = require('./Config/db')
const cloudinary = require('cloudinary')

require('dotenv').config()


const port = process.env.PORT || 4001;

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(port,async ()=>{
    //database connected
    await dbConnect();
    console.log(`server is running at https://localhost/${port}`)
})