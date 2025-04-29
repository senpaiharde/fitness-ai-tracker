// src/models/User.ts
import mongoose, { Schema, Types } from 'mongoose';
import './ScheduleEntry';
import   ScheduleEntry  from './ScheduleEntry';
/* ---------- sub-document: EnhancementLog ---------- */
const enhancementLogSchema = new Schema(
  {
    id: { type: Number, required: true }, // e.g. Date.now()
    date: { type: Date, required: true },
    compound: { type: String, required: true },
    dose: { type: Number, required: true, min: 0 },
    time: { type: String, required: true }, // "08:00"
    goal: { type: String },
    status: { type: String, enum: ['planned', 'done'], default: 'planned' },
  },
  { _id: false } // keep Mongo from adding its own _id to each log
);

/* ---------- sub-document: Profile ---------- */
const profileSchema = new Schema(
  {
    createdAt: { type: Date, default: Date.now },
    age: Number,
    height: Number,
    weight: Number,
    isEnchaned: { type: Boolean, default: false },
    enchancementLog: { type: [enhancementLogSchema], default: [] },
  },
  { _id: false }
);

/* ---------- root User ---------- */
const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    profile: { type: profileSchema, default: () => ({}) },
  },
  { timestamps: true }
);

/* optional: compound index for fast date+hour queries inside the array */
userSchema.index({ _id: 1, 'profile.enchancementLog.date': 1 }, { sparse: true });
export  type ScheduleEntry = Types.Subdocument<typeof ScheduleEntry>;
export type EnhancementLog = Types.Subdocument<typeof enhancementLogSchema>;
export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  passwordHash: string;
  profile: {
    age?: number;
    height?: number;
    weight?: number;
    isEnchaned: boolean;
    enchancementLog: EnhancementLog[];
    
  };
  scheduleEntries?: ScheduleEntry[];
}

// after your userSchema definition
userSchema.virtual('scheduleEntries', {
  ref: 'ScheduleEntry', // name of the model in ScheduleEntry.ts
  localField: '_id',
  foreignField: 'userId',
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

export default mongoose.model<IUser>('User', userSchema);
