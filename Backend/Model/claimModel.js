const mongoose= require('mongoose')


const claimSchema = mongoose.Schema({
    policyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Policy",
        required:[true,"Enter the policy Id"]
    },
    policyholderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PolicyHolder",
        required: [true, "Enter the policyholder Id"]
    },
    status:{
        type:String,
        enum:["Applied","Pending","Approved","Rejected"],
        required:[true,"Enter the status"]
    },
    claimAmount:{
        type:Number,
        required:[true,"Enter the amount"]
    },
    appliedDate:{
        type:Date,
        required:[true,"Enter the date"],
        default:()=>Date.now()
    },
    approvedAmount:{
        type:Number,
    },
    reasonForClaim: {
        type: String,
        enum: ["Medical", "Accident", "Theft", "Natural Disaster", "Other"],
        required: [true, "Enter the reason for the claim"]
    },
    updatedDate: {
        type: Date,
        default: ()=>Date.now()
    }
},{
    timestamps:true,
})

module.exports = mongoose.model("Claim",claimSchema)