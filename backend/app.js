import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import errorMiddleware  from './Middleware/error.middleware.js'
import {config} from 'dotenv'
config()

import morgan from 'morgan'
import userRoutes from './Routes/userRoutes.js'


const app = express()

app.use(express.json())

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}))

app.use(cookieParser())
app.use(morgan('dev'))

app.use('/ping',function(req,res){
  res.send('/pong')
})


app.use('/api/v1/user',userRoutes)

app.use(errorMiddleware)

app.all('*',(req,res)=>{
    res.status(404).send('OOPS! 404 page not found')
})

export default app;