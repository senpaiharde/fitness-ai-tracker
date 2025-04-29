import mongoose, { Schema } from 'mongoose';

export interface IFoodItem extends mongoose.Document {
    name: string,
    servingSizeGrams: number,
    calories: number,
    macros: {
        protein: number,
        carbs: number,
        fat: number,
    };
}

const FoodItemSchema = new Schema<IFoodItem>(
    {
        name: {type: String, required: true},
        servingSizeGrams: {type: Number, required: true},
        calories: {type: Number, required: true},
        macros: {
            protein: {type: Number, required: true},
            carbs: {type: Number, required: true},
            fat: {type: Number, required: true},
        }

    },
    { timestamps: true }
)

export default mongoose.model<IFoodItem>('FoodItem',FoodItemSchema)