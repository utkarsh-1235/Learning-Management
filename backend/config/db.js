import mongoose from 'mongoose'


mongoose.set('strictQuery',false)

const connectToDb = async()=>{
    try{
        const {connection} = await mongoose.connect(
            process.env.MONGO_URL || 'mongodb://localhost:27017/lms'
        )
    
        if(connection){
            console.log(`connected to db:${connection.host}`)
        }

    }
    catch(e){
        console.log(e)
        process.exit(1)
    }
}
export default connectToDb