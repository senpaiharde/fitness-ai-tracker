import mongoose, { Schema, Types, Document, Model } from 'mongoose';

export interface ILifeLog extends Document {
  userId:           Types.ObjectId;
  date:             Date;
  wakeUpTime?:      string;
  sleepTime?:       string;
  training?:        { type: string; startTime?: string; durationMinutes?: number; notes?: string };
  meals?:           Array<{
                      foodItemId?: Types.ObjectId;
                      manualText?: string;
                      time?: string;
                      caloriesEstimate?: number;
                      macrosEstimate?: { protein?: number; carbs?: number; fat?: number };
                    }>;
  studySessions?:   Types.ObjectId[];       // refs to LearningSession
  gamingSessions?:  Array<{ game: string; minutes: number; time?: string }>;
  injectionRecords?:Types.ObjectId[];       // refs to CompoundInjection
  supplementsTaken?:Types.ObjectId[];       // refs to SupplementIntake
  distractions?:    Array<{ activity: string; durationMinutes?: number }>;
  moodTimeline?:    Array<{ timeBlock: string; moodRating: number }>;
  healthMetrics?:   {
                      restingHeartRate?: number;
                      bloodPressure?: string;
                      weightKg?: number;
                      bodyFatPercentEstimate?: number;
                    };
  problems?:        string;
  wins?:            string;
  reflection?:      string;
}

const LifeLogSchema = new Schema<ILifeLog>(
  {
    userId:           { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date:             { type: Date, required: true, index: true },
    wakeUpTime:       String,
    sleepTime:        String,
    training: {
      type: new Schema(
        {
          type:           { type: String, required: true },
          startTime:      String,
          durationMinutes:Number,
          notes:          String
        },
        { _id: false }
      )
    },
    meals: [
      new Schema(
        {
          foodItemId:       { type: Schema.Types.ObjectId, ref: 'FoodItem' },
          manualText:       String,
          time:             String,
          caloriesEstimate: Number,
          macrosEstimate: {
            protein: Number,
            carbs:   Number,
            fat:     Number
          }
        },
        { _id: false }
      )
    ],

    
    studySessions:   [{ type: Schema.Types.ObjectId, ref: 'LearningSession' }],
    gamingSessions: [
      new Schema(
        {
          game:    { type: String, required: true },
          minutes: { type: Number, required: true },
          time:    String
        },
        { _id: false }
      )
    ],
    injectionRecords:[{ type: Schema.Types.ObjectId, ref: 'CompoundInjection' }],

    
    supplementsTaken:[{ type: Schema.Types.ObjectId, ref: 'SupplementIntake' }],
    distractions:     [
      { activity: String, durationMinutes: Number }
    ],
    moodTimeline:     [
      { timeBlock: String, moodRating: Number }
    ],
    healthMetrics:    {
      restingHeartRate: Number,
      bloodPressure:    String,
      weightKg:         Number,
      bodyFatPercentEstimate: Number
    },
    problems:         String,
    wins:             String,
    reflection:       String
  },
  { timestamps: true }
);

LifeLogSchema.index({ userId: 1, date: 1 });

export const LifeLog: Model<ILifeLog> =
  mongoose.models.LifeLog || mongoose.model('LifeLog', LifeLogSchema);
