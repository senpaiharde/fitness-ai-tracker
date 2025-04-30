import mongoose, { Schema, Types } from 'mongoose';

export interface IScheduleEntry extends mongoose.Document { 
    userId: Types.ObjectId | string;
    date: Date,
    taskTitle: string,
    taskType?: string,
    plannedStart: string,
    plannedEnd: string,
    actualStart?: string,
    actualEnd?: string,
    status: 'planned'|'done'|'skipped',
    priority: 'low'|'medium'|'high',
    recurrenceRule?: string,
    goalId?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const scheduleEntrySchema = new Schema<IScheduleEntry>(
    {
        userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        date:          { type: Date, required: true, index: true },
        taskTitle:     { type: String, required: true },
        taskType:      String,
        plannedStart:  String,
        plannedEnd:    String,
        actualStart:   String,
        actualEnd:     String,
        status:        { type: String, enum: ['planned','done','skipped'], default: 'planned' },
        priority:      { type: String, enum: ['low','medium','high'], default: 'medium' },
        recurrenceRule:String,
        goalId:        { type: Schema.Types.ObjectId, ref: 'Goal' },
      },
      { timestamps: true }
)

scheduleEntrySchema.index({userId: 1, date: 1, plannedStart: 1});

export default mongoose.model<IScheduleEntry>("ScheduleEntry", scheduleEntrySchema);