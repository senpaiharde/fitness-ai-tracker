// src/models/Summary.ts
import mongoose, { Schema, Types } from 'mongoose';

export interface ISummary extends mongoose.Document {
  userId: Types.ObjectId;
  periodType: 'weekly' | 'monthly' | 'custom';
  periodStart: Date;
  periodEnd: Date;
  metrics: {
    totalTasksPlanned?: number;
    totalTasksCompleted?: number;
    totalTrainingHours?: number;
    avgMoodRating?: number;
    weightChangeKg?: number;
    newPersonalRecords?: string[];
  };
  biggestWins?: string;
  mainProblems?: string;
  adjustmentPlan?: string;
}

const SummarySchema = new Schema<ISummary>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    periodType:  { type: String, enum: ['weekly','monthly','custom'], default: 'weekly' },
    periodStart: { type: Date, required: true },
    periodEnd:   { type: Date, required: true },
    metrics: {
      totalTasksPlanned:   Number,
      totalTasksCompleted: Number,
      totalTrainingHours:  Number,
      avgMoodRating:       Number,
      weightChangeKg:      Number,
      newPersonalRecords:  [String]
    },
    biggestWins:    String,
    mainProblems:   String,
    adjustmentPlan: String
  },
  { timestamps: true }
);

SummarySchema.index({ userId: 1, periodStart: 1 });

export default mongoose.model<ISummary>('Summary', SummarySchema);
