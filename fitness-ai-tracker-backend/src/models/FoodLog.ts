import mongoose, { Schema, Types } from 'mongoose';

export interface IFoodLog extends mongoose.Document {
  userId: Types.ObjectId;
  timestamp: Date;
  foodItemId?: Types.ObjectId;
  manualText?: string;
  grams?: number;
  calories?: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
  notes?: string;
}

const FoodLogSchema = new Schema<IFoodLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    timestamp: { type: Date, default: Date.now, index: true },
    foodItemId: { type: Schema.Types.ObjectId, ref: 'FoodItem' },
    manualText: String,
    grams: Number,
    calories: Number,
    macros: {
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
