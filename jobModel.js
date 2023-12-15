import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Companyname is require'],
    },
    position:{
        type:String,
        required:[true,'Job Position is required'],
        maxlength:100,
    },
    status:{
        type:String,
        enum:['pending','reject','interview'],
        default:'pending',
    },
    workType:{
        type:String,
        enum:['Full-time','Part-time','internship','contract'],
        default:'Full-time',
    },
    Location:{
        type:String,
        default:'Mumbai',
        required:[true,'Work location is required'],
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
    },
},{timestamps:true}
);

export default mongoose.model('Job',jobSchema)