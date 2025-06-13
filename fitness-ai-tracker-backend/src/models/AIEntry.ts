import mongoose, { Schema, Types, Document, Model } from 'mongoose';

export interface IAIEntry extends Document {
   userId:        mongoose.Types.ObjectId;
  timestamp:     Date;
  rawText:       string;
  workout?:      {
    type:     string;
    weightKg?: number;
    reps?:     number;
    time?:     string;
  };
  studyMinutes?: number;
  foodPlan?:     string;
  gaming?:       {
    game:    string;
    minutes: number;
    time?:   string;
  };
  injection?:    {
    compound: string;
    doseMg:   number;
    time?:    string;
  };
}

const WorkoutSchema = new Schema(
  {
    type:     { type: String, required: true },
    weightKg: Number,
    reps:     Number,
    time:     String
  },
  { _id: false }
);

const GamingSchema = new Schema(
  {
    game:    { type: String, required: true },
    minutes: { type: Number, required: true },
    time:    String
  },
  { _id: false }
);

const InjectionSchema = new Schema(
  {
    compound: { type: String, required: true },
    doseMg:   { type: Number, required: true },
    time:     String
  },
  { _id: false }
);

const AIEntrySchema = new Schema<IAIEntry>(
  {
    userId:      {
      type: Schema.Types.ObjectId,     
      ref: 'User',
      required: true
    },
    timestamp:   { type: Date, default: Date.now },
    rawText:     { type: String, required: true },

    workout:     { type: WorkoutSchema, required: false },
    studyMinutes:{ type: Number, required: false },
    foodPlan:    { type: String, required: false },
    gaming:      { type: GamingSchema, required: false },
    injection:   { type: InjectionSchema, required: false }
  },
  { _id: true }
);


AIEntrySchema.index({ userId: 1, timestamp: -1 });
AIEntrySchema.index({ rawText: 'text' });

export const AIEntry: Model<IAIEntry> =
  (mongoose.models.AIEntry as Model<IAIEntry>) ||
  mongoose.model<IAIEntry>('AIEntry', AIEntrySchema);
