const express = require('express')
const dotenv = require('dotenv').config()
const { Buffer, SlowBuffer } = require('buffer')

// Compatibility shim for newer Node versions that no longer expose the old SlowBuffer.equal API
if (typeof SlowBuffer === 'function' && Buffer?.prototype?.equal) {
  if (!SlowBuffer.prototype.equal) {
    SlowBuffer.prototype.equal = Buffer.prototype.equal
  }
}

const mongoose = require('mongoose')
const morgan = require('morgan')
const logger = require('./logger')
const {errorHandler} = require('./Middleware/errorMiddleware')
const cors = require('cors')
const { swaggerUi, specs } = require('./swagger-config'); 

const port = process.env.PORT || 5000

const app = express()

// HTTP request logging middleware
const morganStream = {
  write: (message) => logger.info(message.trim()),
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors({origin:'*'}));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(errorHandler)

mongoose.connect("mongodb+srv://shanmukhareddyvasa:shanmukha12345@shanmukhacluster.nmaie.mongodb.net/?appName=ShanmukhaCLuster",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    logger.info("MongoDB Connected Successfully")
}).catch(err=>{
    logger.error("MongoDB Connection Error: %o", err)
})


app.use('/users',require("./Routes/goUsers"))
app.use('/policies',require("./Routes/goPolicy"))
app.use('/claims',require("./Routes/goClaims"))
app.use('/policyholder',require("./Routes/goPolicyholder"))
app.listen(port,()=>{
    logger.info(`Server runs on port ${port}`)
})