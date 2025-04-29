import mongoose, { Schema, Types } from 'mongoose';
import { IUser } from './User';
/* ---------- sub-document: Usersettings.ts ---------- */
export interface IUserSettings extends mongoose.Document {
  userId: Types.ObjectId;
  preferredWakeTime?: string;
  preferredSleepTime?: string;
  learningFocusAreas: string[],
  supplementProtocols: Types.ObjectId[],
  dailyLogReminder: boolean,
  weeklyReviewDay:'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun';
}


const UserSettingsSchema = new Schema<IUserSettings>(
    {
        userId : {type: Schema.Types.ObjectId, ref: 'User', required: true, index: true},
        preferredWakeTime: String,
        preferredSleepTime: String,
        learningFocusAreas: { type: [String], default: [] },
        supplementProtocols:{ type: [Schema.Types.ObjectId], ref: 'Supplement', default: [] },
        dailyLogReminder: {type: Boolean, default: true},
        weeklyReviewDay: {type: String, enum:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], default: 'Sun'}

    },
    {timestamps: true}
);

UserSettingsSchema.index({userId: 1}, {unique: true});

export default mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema)

