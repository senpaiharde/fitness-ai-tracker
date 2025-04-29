// src/models/Goal.ts
import mongoose, { Schema, Types } from 'mongoose';

export interface IGoal extends mongoose.Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  createdAt: Date;
  targetDate?: Date;
  status: 'active'|'paused'|'completed';
}

const GoalSchema = new Schema<IGoal>(
  {
    userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:      { type: String, required: true },
    description:String,
    targetDate: Date,
    status:     { type: String, enum: ['active','paused','completed'], default: 'active' }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

GoalSchema.index({ userId: 1 });

export default mongoose.model<IGoal>('Goal', GoalSchema);
