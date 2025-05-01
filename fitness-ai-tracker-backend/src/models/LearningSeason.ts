import mongoose, { Schema, Types } from 'mongoose';


export interface ILearningSession extends mongoose.Document{
    userId: Types.ObjectId, 
    date: Date,
    topic: string,
    startTime: string,
    endTime: string,
    notes? : string,
}


const LearningSessionSchema = new Schema<ILearningSession>(
    {
        userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true},
        date:      { type: Date, required: true, index: true },
        topic:     { type: String, required: true },
        startTime: String,
        endTime:   String,
        notes:     String
    },
    {timestamps: true}
)

LearningSessionSchema.index({userId: 1 , date: 1});
export default mongoose.model<ILearningSession>('LearningSession',LearningSessionSchema);