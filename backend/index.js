const app = require('./app')

require('dotenv').config()
const port = process.env.PORT || 4001;

app.listen(port,()=>{
    console.log(`server is running at https://localhost/${port}`)
})