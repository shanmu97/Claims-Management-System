const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const {errorHandler} = require('./Middleware/errorMiddleware')
const cors = require('cors')
const { swaggerUi, specs } = require('./swagger-config'); 

const port = process.env.PORT || 5000

const app = express()


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors({origin:'*'}));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(errorHandler)

mongoose.connect("mongodb+srv://iambharath1417_db_user:Wot9pBVna4skZUnj@cluster0.ci36vra.mongodb.net/?appName=Cluster0",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("MongoDB Connected")
}).catch(err=>{
    console.error(err)
})


app.use('/users',require("./Routes/goUsers"))
app.use('/policies',require("./Routes/goPolicy"))
app.use('/claims',require("./Routes/goClaims"))
app.use('/policyholder',require("./Routes/goPolicyholder"))
app.listen(port,()=>{
    console.log(`Server runs on port ${port}`)
})