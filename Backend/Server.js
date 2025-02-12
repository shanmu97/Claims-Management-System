const express = require('express')
const dotenv = require('dotenv').config()

const port = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/users',require("./Routes/goUsers"))
app.use('/policy',require("./Routes/goPolicy"))
app.use('/claims',require("./Routes/goClaims"))
app.use('/policyholder',require("./Routes/goPolicyholder"))
app.use('/payment',require("./Routes/goPayment"))

app.listen(port,()=>{
    console.log(`Server runs on port ${port}`)
})