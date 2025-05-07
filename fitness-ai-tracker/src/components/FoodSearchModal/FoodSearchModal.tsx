import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { searchFoodItems, selectResults, clear } from "../../features/foodCatalog/foodCatalogSlice";
import { updateFoodLog } from "../../features/food/foodLogs";
import { IoMdReturnLeft } from "react-icons/io";



export default function FoodSearchModal ({date, onClose}) {
    const dispatch = useAppDispatch();
    const results  = useAppSelector(selectResults);

    const [query, setQuery] = useState('')
    const [food, setFood] = useState<any|null>(null)
    const [grams, setGrams] = useState(100)

    useEffect(() => {
        if(!query) {dispatch(clear()); return;}
        const id = setTimeout(() => dispatch(searchFoodItems(query)), 300);
        return () => clearTimeout(id);
    },[query])

    const choose = (f: any) => {setFood(f); setGrams(f.servingSizeGrams); dispatch(clear());}

    const factor = food ? grams / food.servingSizeGrams : 0;
    const preview = food && {
        kcal : Math.round(food.calories * factor),
        p: (food.macros.protein * factor).toFixed(1),
        c: (food.macros.carbs * factor).toFixed(1),
        f: (food.macros.fat * factor).toFixed(1),
    }


    const add = () => {
        if(!food) return;
        dispatch(updateFoodLog({
            date,
            hour: new Date().getHours(),
            updates: {foodItemId: food._id, grams, foodLog: 'evening'}
        }))
        onClose()
    };

    return(
        <div>
            <input value={query} 
            onChange={(e) => setQuery(e.target.value)} placeholder="Search food..."/>

            {!!results.length && (
                <ul>
                    {results.map(r=>(
                        <li key={r._id??r.name} onClick={() => choose(r)}>
                            {r.name} - {r.calories} kcal / {r.servingSizeGrams}g

                        </li>
                    ))}
                </ul>
            )}

            {food && (
                <>
                <h4>{food.name}</h4>
                <label>
                Grams&nbsp;
                <input type='number' />
                </label></>
            )}
        </div>
    )

  
}