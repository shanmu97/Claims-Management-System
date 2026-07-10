const logger = require('../logger')

const errorHandler = (err,req,res,next)=>{
    const statusCode = res.statusCode?res.statusCode:500;
    
    // Log the error using winston
    logger.error(`Error occurred on ${req.method} ${req.url} - Status ${statusCode} - Message: ${err.message}`, { stack: err.stack });

    res.status(statusCode)
    res.json({
        message:err.message,
        stack:err.stack
    })
}
module.exports={
    errorHandler,
}