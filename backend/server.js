import app from './app.js'
import connectToDb from './config/db.js'


const port = process.env.PORT||5000


app.listen(port,async()=>{
  await connectToDb()
    console.log(`App is running at http:localhost:${port}`)
})