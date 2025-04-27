import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    name:String,
    passwordHash : String,
    profile: {
        createdAt: { type: Date, default: Date.now },
        age: Number,
        height: Number,
        weight: Number,
        isEnchaned: Boolean,
        enchancementLog: { type: Array, default: [] },
      },
    });
    
    export default mongoose.model("User", userSchema);