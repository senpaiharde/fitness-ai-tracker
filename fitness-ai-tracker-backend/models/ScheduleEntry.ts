import mongoose from "mongoose";


const entrySchema = new mongoose.Schema({
    userId : {type:String, required: true, index : true},
    date : {type:String, required: true, index : true},
    hour : {type:Number,min:0 , max:23, required: true, index : true},
    planned: String,
    actual: String,
    tags: [String],
    status: {type:String, enum: ['planned','done'], default:'planned'},

},{timestamps:true});

entrySchema.index({ userId:1, date:1, hour:1 }, { unique:true });


export default mongoose.model('ScheduleEntry',entrySchema);