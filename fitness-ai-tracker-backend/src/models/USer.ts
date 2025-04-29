// src/models/User.ts
import mongoose, { Schema, Types } from 'mongoose';
import './ScheduleEntry';

/* ---------- sub-document: User.ts ---------- */


export interface Iuser extends mongoose.Document {
    fullname: string,
    email: string,
    birthdate?: Date,
    weightKg?: number,
    baselineBodyFatPercent?: number,
    goals: string[],
    timeZone: string,
    notificationPrefs: {
        email: boolean;
        push: boolean;
    },
    uiTheme: 'light' | 'dark';
    createdAt: Date,
}

const userSchema = new Schema<Iuser>(
    {
        fullname: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        birthdate: Date,
        weightKg: Number,
        baselineBodyFatPercent: Number,
        goals: {type: [String], default: []},
        timeZone: {type: String, default: 'UTC'},
        notificationPrefs: {
            email: {type:Boolean, default: true},
            push: {type: Boolean, default:true}
        },
        uiTheme: {type: String, enum : ['light','dark'],default:'dark'}
    },
    {timestamps:{createdAt:'createdAt', updatedAt: false}}
)

export default mongoose.model<Iuser>('user',userSchema);