import mongoose, { Schema, Types } from 'mongoose';


export interface ILearningSession extends mongoose.Document{
    userId: Types.ObjectId, 
    date: Date,
    hour:      number; 
    topic: string,
    startTime: string,
    endTime: string,
    notes? : string,
    status: 'planned' | 'done' | 'skipped';
    priority: 'low' | 'medium' | 'high';
    goalId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}


const LearningSessionSchema = new Schema<ILearningSession>(
    {
        userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true},
        date:      { type: Date, required: true, index: true },
        hour:         { type: Number, required: true },
        topic:     { type: String, required: true },
        status: { type: String, enum: ['planned', 'done', 'skipped'], default: 'planned' },
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        startTime: String,
        endTime:   String,
        notes:     String,
        goalId: { type: Schema.Types.ObjectId, ref: 'Goal' },
    },
    {timestamps: true}
)

LearningSessionSchema.index({userId: 1 , date: 1});
export default mongoose.model<ILearningSession>('LearningSession',LearningSessionSchema);