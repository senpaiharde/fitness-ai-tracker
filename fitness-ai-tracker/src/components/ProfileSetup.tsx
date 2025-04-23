import React from "react";

import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { updateProfile, login } from "../features/user/userSlice";
import type { FC, JSX } from "react";

// fc its funcinal component and jsx.element its gonna incloud jsx
const ProfileSetup: FC = (): JSX.Element => {  
    const dispatch = useAppDispatch();

    const [age, setAge] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [isEnchanded, setIsEnchanded] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(login({ id: "u123", email: "you@gmail.com" }));

        dispatch(
            updateProfile({
                age: typeof age === "number" ? age : undefined,
                weight: typeof weight === "number" ? weight : undefined,
                height: typeof height === "number" ? height : undefined,
                isEnchanded,
            })
        );
    };
    return(
        <div style={{padding:'2rem'}} className="">
            <h2>Profile Setup</h2>
            <form onSubmit={handleSubmit} 
            style={{display:'flex',
                flexDirection:'column',
                gap:'1rem'
            }}>
                <input 
                type="number"
                placeholder="Weught (kg)"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                />
                <input 
                type="number"
                placeholder="Height (em)"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                />
                <label>
                <input 
                type="checkbox"
                
                checked={isEnchanded}
                onChange={() => setIsEnchanded(!isEnchanded)}
                />
                Enhanced (steroids/sarms)
                </label>
                <button type="submit">Save Profile</button>

            </form>
        </div>
    )
};

export default ProfileSetup;