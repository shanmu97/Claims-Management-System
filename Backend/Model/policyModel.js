const mongoose= require('mongoose')

const policySchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter the policy name"]
    },
    type:{type:String,
        enum:["Life","Auto","Health","Home","Travel"],
        required:[true,"Select your policy type"],
        
    },
    amount:{
        type:Number,
        required:[true,"Enter your coverage amount"]
    },
    premium:{
        type:String,
        enum:["Monthly","Quarterly","Halfyearly","Annually"],
        required:[true,"Enter the premium amount"]
    },
    description:{
        type:String,
        required:[true,"Enter the Description"]
    }
},{
    timestamps:true,
})

module.exports = mongoose.model("Policy",policySchema)