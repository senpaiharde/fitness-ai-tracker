import mongoose, { Schema, Types } from 'mongoose';

export interface ISupplementIntake extends mongoose.Document{
    userId: Types.ObjectId,
    supplementId: Types.ObjectId,
    timestamp: Date,
    dosageMg: number,
    notes? : string,
}

const SupplementIntakeSchema = new Schema<ISupplementIntake>(
    {
        userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true},
        supplementId: { type: Schema.Types.ObjectId, ref: 'Supplement', required: true },
        timestamp:    { type: Date, default: Date.now, index: true },
        dosageMg:     { type: Number, required: true },
        notes:        String
      },
      { timestamps: false }
);

SupplementIntakeSchema.index({ userId: 1, timestamp: 1 });

export default mongoose.model<ISupplementIntake>('SupplementIntake',SupplementIntakeSchema)