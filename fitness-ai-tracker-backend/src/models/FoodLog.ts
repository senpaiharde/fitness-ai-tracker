import mongoose, { Schema, Types } from 'mongoose';

export interface IFoodLog extends mongoose.Document {
  userId: Types.ObjectId | string;
  date: Date;
  hour: number;
  timestamp: Date;
  foodItemId?: Types.ObjectId;
  manualText?: string;
  grams?: number;
  calories?: number;
  foodLog: 'morning' | 'evening' | 'night';
  macros?: {
    totalCalories: Number,
    protein: number;
    carbs: number;
    fat: number;
  };
  notes?: string;
}

const FoodLogSchema = new Schema<IFoodLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, index: true },
    timestamp: { type: Date, default: Date.now, index: true },
    hour: { type: Number, required: true },
    foodItemId: { type: Schema.Types.ObjectId, ref: 'FoodItem' },
    manualText: String,
    grams: Number,
    foodLog: { type: String, enum: ['morning', 'evening', 'night'], default: 'morning' },
    calories: Number,
    macros: {
      totalCalories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    notes: String,
  },
  { timestamps: false }
);

FoodLogSchema.index({ userId: 1, timestamp: 1 });

export default mongoose.model<IFoodLog>('FoodLog', FoodLogSchema);
