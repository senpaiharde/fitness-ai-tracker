// src/models/CompoundInjection.ts
import mongoose, { Schema, Types } from 'mongoose';

export interface ICompoundInjection extends mongoose.Document {
  userId: Types.ObjectId;
  compoundId: Types.ObjectId;
  timestamp: Date;
  dosageMg: number;
  injectionSite?: string;
  notes?: string;
}

const CompoundInjectionSchema = new Schema<ICompoundInjection>(
  {
    userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    compoundId:   { type: Schema.Types.ObjectId, ref: 'Compound', required: true },
    timestamp:    { type: Date, default: Date.now, index: true },
    dosageMg:     { type: Number, required: true },
    injectionSite:String,
    notes:        String
  },
  { timestamps: false }
);

CompoundInjectionSchema.index({ userId: 1, timestamp: 1 });

export default mongoose.model<ICompoundInjection>('CompoundInjection', CompoundInjectionSchema);
